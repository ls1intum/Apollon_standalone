import { ApollonEditor, ApollonMode, Patch, Selection, UMLModel } from '@ls1intum/apollon';
import React, { useEffect, useRef, useState, useContext } from 'react';
import styled from 'styled-components';
import { DiagramView } from 'shared/src/main/diagram-view';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { APPLICATION_SERVER_VERSION, DEPLOYMENT_URL, NO_HTTP_URL, WS_PROTOCOL } from '../../constant';
import { DiagramRepository } from '../../services/diagram/diagram-repository';

import { uuid } from '../../utils/uuid';
import { ModalContentType } from '../modals/application-modal-types';
import { selectionDiff } from '../../utils/selection-diff';
import { CollaborationMessage } from '../../utils/collaboration-message-type';

import {
  changeEditorMode,
  changeReadonlyMode,
  selectCreatenewEditor,
  setCreateNewEditor,
  updateDiagramThunk,
} from '../../services/diagram/diagramSlice';
import { useParams, useSearchParams } from 'react-router-dom';
import { ApollonEditorContext } from './apollon-editor-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateCollaborators } from '../../services/share/shareSlice';
import { useImportDiagram } from '../../services/import/useImportDiagram';
import { showModal } from '../../services/modal/modalSlice';

const ApollonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  overflow: hidden;
`;

export const ApollonEditorComponentWithConnection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ApollonEditor | null>(null);
  const clientRef = useRef<W3CWebSocket | null>(null);
  const [selection, setSelection] = useState<Selection>({ elements: {}, relationships: {} });
  const { token } = useParams();
  // const { collaborationName, collaborationColor } = useAppSelector((state) => state.share);
  const collaborationName = 'EGE' + Math.floor(Math.random() * 16777215).toString(16);
  const collaborationColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  const dispatch = useAppDispatch();
  const importDiagram = useImportDiagram();
  const { diagram: reduxDiagram } = useAppSelector((state) => state.diagram);
  const options = useAppSelector((state) => state.diagram.editorOptions);
  const createNewEditor = useAppSelector(selectCreatenewEditor);
  const editorContext = useContext(ApollonEditorContext);
  const setEditor = editorContext!.setEditor;
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');

  const establishCollaborationConnection = (token: string, name: string, color: string) => {
    console.log('establishCollaborationConnection token:', token);
    console.log('establishCollaborationConnection name:', name);
    console.log('establishCollaborationConnection color:', color);

    const newClient = new W3CWebSocket(`${WS_PROTOCOL}://${NO_HTTP_URL}`);
    clientRef.current = newClient;

    newClient.onopen = () => {
      const collaborators = { name, color };
      newClient.send(JSON.stringify({ token, collaborators }));
    };

    newClient.onmessage = async (message: any) => {
      const { originator, collaborators, diagram, patch, selection } = JSON.parse(message.data) as CollaborationMessage;

      console.log('Received message:', message.data);

      if (collaborators) {
        dispatch(updateCollaborators(collaborators));
        editorRef.current?.pruneRemoteSelectors(collaborators);
      }
      if (diagram?.model && editorRef.current) {
        // importDiagram(JSON.stringify(diagram));
        await editorRef.current.nextRender;
        editorRef.current.model = diagram.model;
      }
      if (patch) {
        editorRef.current?.importPatch(patch);
      }
      if (selection && originator) {
        editorRef.current?.remoteSelect(originator.name, originator.color, selection.selected, selection.deselected);
      }
    };
  };
  useEffect(() => {
    const initializeEditor = async () => {
      if (
        token &&
        APPLICATION_SERVER_VERSION &&
        DEPLOYMENT_URL &&
        containerRef.current &&
        createNewEditor &&
        reduxDiagram &&
        setEditor
      ) {
        if (!editorRef.current) {
          let editorOptions = structuredClone(options);

          if (view) {
            switch (view) {
              case DiagramView.SEE_FEEDBACK:
                dispatch(changeEditorMode(ApollonMode.Assessment));
                dispatch(changeReadonlyMode(true));
                editorOptions.mode = ApollonMode.Assessment;
                editorOptions.readonly = true;
                break;
              case DiagramView.GIVE_FEEDBACK:
                dispatch(changeEditorMode(ApollonMode.Assessment));
                dispatch(changeReadonlyMode(false));
                editorOptions.mode = ApollonMode.Assessment;
                editorOptions.readonly = false;
                break;
              case DiagramView.EDIT:
                dispatch(changeEditorMode(ApollonMode.Modelling));
                dispatch(changeReadonlyMode(false));
                editorOptions.mode = ApollonMode.Modelling;
                editorOptions.readonly = false;
                break;
              case DiagramView.COLLABORATE:
                dispatch(changeEditorMode(ApollonMode.Modelling));
                dispatch(changeReadonlyMode(false));
                editorOptions.mode = ApollonMode.Modelling;
                editorOptions.readonly = false;
                // if (!collaborationName || !collaborationColor) {
                //   dispatch(showModal({ type: ModalContentType.CollaborationModal, size: 'lg' }));
                // }
                if (!clientRef.current) {
                  establishCollaborationConnection(token, collaborationName, collaborationColor);
                }
                break;
            }
          }

          DiagramRepository.getDiagramFromServerByToken(token).then(async (diagram) => {
            console.log('getDiagramFromServerByToken diagram:', diagram);
            if (diagram) {
              if (containerRef.current) {
                if (editorRef.current) {
                  await editorRef.current.nextRender;
                  editorRef.current.destroy();
                }

                const editor = new ApollonEditor(containerRef.current, editorOptions);
                editorRef.current = editor;
                await editorRef.current?.nextRender;

                editorRef.current.model = diagram.model;

                editorRef.current.subscribeToAllModelChangePatches((patch: Patch) => {
                  console.log('subscribeToAllModelChangePatches patch:', patch);
                  if (clientRef.current) {
                    clientRef.current.send(
                      JSON.stringify({
                        token,
                        collaborator: { name: collaborationName, color: collaborationColor },
                        patch,
                      }),
                    );
                  }
                });

                editorRef.current.subscribeToModelChange((model: UMLModel) => {
                  console.log('subscribeToModelChange model:', model);

                  const diagram = { ...reduxDiagram, model };
                  dispatch(updateDiagramThunk(diagram));
                });

                editorRef.current.subscribeToSelectionChange((newSelection) => {
                  console.log('subscribeToSelectionChange newSelection:', newSelection);
                  const diff = selectionDiff(selection, newSelection);
                  setSelection(newSelection);

                  if (clientRef.current && (diff.selected.length > 0 || diff.deselected.length > 0)) {
                    clientRef.current.send(
                      JSON.stringify({
                        token,
                        collaborator: { name: collaborationName, color: collaborationColor },
                        selection: diff,
                      }),
                    );
                  }
                });

                setEditor(editorRef.current);
                dispatch(setCreateNewEditor(false));
              }
            }
          });
        }
      }
    };

    initializeEditor();
  }, [containerRef.current]);

  const key = reduxDiagram?.id || uuid();

  return <ApollonContainer key={key} ref={containerRef} />;
};
