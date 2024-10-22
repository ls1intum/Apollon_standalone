import { ApollonEditor, ApollonMode, Patch, UMLModel } from '@ls1intum/apollon';
import React, { useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { DiagramView } from 'shared/src/main/diagram-view';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { APPLICATION_SERVER_VERSION, DEPLOYMENT_URL, NO_HTTP_URL, WS_PROTOCOL } from '../../constant';
import { DiagramRepository } from '../../services/diagram/diagram-repository';

import { uuid } from '../../utils/uuid';
import { ModalContentType } from '../modals/application-modal-types';
import { selectionDiff } from '../../utils/selection-diff';
import { CollaborationMessage } from '../../utils/collaboration-message-type';

import { selectCreatenewEditor, setCreateNewEditor, updateDiagramThunk } from '../../services/diagram/diagramSlice';
import { useParams, useSearchParams } from 'react-router-dom';
import { ApollonEditorContext } from './apollon-editor-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateCollaborators } from '../../services/share/shareSlice';
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
  const selectionRef = useRef({ elements: {}, relationships: {} });
  const { token } = useParams();
  const { name: collaborationName, color: collaborationColor } = useAppSelector(
    (state) => state.share.userCollaborationData,
  );
  const dispatch = useAppDispatch();
  const { diagram: reduxDiagram } = useAppSelector((state) => state.diagram);
  const options = useAppSelector((state) => state.diagram.editorOptions);
  const createNewEditor = useAppSelector(selectCreatenewEditor);
  const editorContext = useContext(ApollonEditorContext);
  const setEditor = editorContext!.setEditor;
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');

  const establishCollaborationConnection = async (token: string, name: string, color: string) => {
    const newClient = new W3CWebSocket(`${WS_PROTOCOL}://${NO_HTTP_URL}`);

    clientRef.current = newClient;

    await new Promise<void>((resolve, reject) => {
      clientRef.current!.onopen = () => {
        resolve();
      };

      clientRef.current!.onerror = (error) => {
        reject(error);
      };
    });
    const collaborators = { name, color };
    clientRef.current!.send(JSON.stringify({ token, collaborators }));

    clientRef.current.onmessage = async (message: any) => {
      const { originator, collaborators, diagram, patch, selection } = JSON.parse(message.data) as CollaborationMessage;

      if (editorRef.current) {
        await editorRef.current.nextRender;

        if (collaborators) {
          dispatch(updateCollaborators(collaborators));
          editorRef.current.pruneRemoteSelectors(collaborators);
        }
        if (diagram?.model && editorRef.current) {
          dispatch(updateDiagramThunk({ model: diagram.model }));
          editorRef.current.model = diagram.model;
        }
        if (patch && editorRef.current) {
          editorRef.current?.importPatch(patch);
        }
        if (selection && originator && editorRef.current) {
          editorRef.current?.remoteSelect(originator.name, originator.color, selection.selected, selection.deselected);
        }
      }
    };

    if (editorRef.current) {
      editorRef.current.subscribeToAllModelChangePatches((patch: Patch) => {
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

      editorRef.current.subscribeToSelectionChange((newSelection) => {
        const diff = selectionDiff(selectionRef.current, newSelection);
        selectionRef.current = newSelection;

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
    }
  };
  useEffect(() => {
    const initializeEditor = async () => {
      const shouldConnectToServer =
        view === DiagramView.COLLABORATE || view === DiagramView.GIVE_FEEDBACK || view === DiagramView.SEE_FEEDBACK;
      const haveConnectionData = collaborationName && collaborationColor;

      if (shouldConnectToServer && !haveConnectionData) {
        dispatch(setCreateNewEditor(true));
        dispatch(showModal({ type: ModalContentType.CollaborationModal, size: 'lg' }));
        return;
      }

      if (token && APPLICATION_SERVER_VERSION && DEPLOYMENT_URL && containerRef.current && createNewEditor) {
        let editorOptions = structuredClone(options);

        if (view) {
          switch (view) {
            case DiagramView.SEE_FEEDBACK:
              editorOptions.mode = ApollonMode.Assessment;
              editorOptions.readonly = true;
              break;
            case DiagramView.GIVE_FEEDBACK:
              editorOptions.mode = ApollonMode.Assessment;
              editorOptions.readonly = false;
              break;
            case DiagramView.EDIT:
              editorOptions.mode = ApollonMode.Modelling;
              editorOptions.readonly = false;
              break;
            case DiagramView.COLLABORATE:
              editorOptions.mode = ApollonMode.Modelling;
              editorOptions.readonly = false;
              break;
          }
        }

        DiagramRepository.getDiagramFromServerByToken(token).then(async (diagram) => {
          if (diagram) {
            if (editorRef.current) {
              await editorRef.current.nextRender;
              editorRef.current.destroy();
            }
            const editor = new ApollonEditor(containerRef.current!, editorOptions);
            await editor.nextRender;
            editorRef.current = editor;

            await editorRef.current.nextRender;
            editorRef.current.type = diagram.model.type;
            await editorRef.current.nextRender;
            editorRef.current.model = diagram.model;

            editorRef.current.subscribeToModelChange((model: UMLModel) => {
              const diagram = { ...reduxDiagram, model };
              dispatch(updateDiagramThunk(diagram));
            });

            if (shouldConnectToServer) {
              establishCollaborationConnection(token, collaborationName!, collaborationColor!);
            }

            setEditor(editorRef.current);
            dispatch(setCreateNewEditor(false));
          }
        });
      }
    };

    initializeEditor();
  }, [containerRef.current, collaborationName, createNewEditor]);

  useEffect(() => {
    dispatch(setCreateNewEditor(true));
  }, [view]);

  const key = reduxDiagram?.id || uuid();

  return <ApollonContainer key={key} ref={containerRef} />;
};
