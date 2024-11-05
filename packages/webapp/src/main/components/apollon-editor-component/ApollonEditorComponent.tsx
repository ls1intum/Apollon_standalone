import { ApollonEditor, ApollonMode, UMLModel } from '@ls1intum/apollon';
import React, { useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { uuid } from '../../utils/uuid';

import { setCreateNewEditor, updateDiagramThunk, selectCreatenewEditor } from '../../services/diagram/diagramSlice';
import { ApollonEditorContext } from './apollon-editor-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectPreviewedDiagramIndex } from '../../services/version-management/versionManagementSlice';
import { DiagramRepository } from '../../services/diagram/diagram-repository';
import { toast } from 'react-toastify';

const ApollonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  overflow: hidden;
`;

export const ApollonEditorComponent: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<ApollonEditor | null>(null);
  const dispatch = useAppDispatch();
  const { diagram: reduxDiagram } = useAppSelector((state) => state.diagram);
  const options = useAppSelector((state) => state.diagram.editorOptions);
  const createNewEditor = useAppSelector(selectCreatenewEditor);
  const previewedDiagramIndex = useAppSelector(selectPreviewedDiagramIndex);
  const editorContext = useContext(ApollonEditorContext);
  const setEditor = editorContext?.setEditor;

  useEffect(() => {
    const initializeEditor = async () => {
      if (containerRef.current != null && createNewEditor) {
        if (editorRef.current) {
          await editorRef.current.nextRender;
          editorRef.current.destroy();
        }
        editorRef.current = new ApollonEditor(containerRef.current, options);
        await editorRef.current?.nextRender;

        if (reduxDiagram.model) {
          editorRef.current.model = reduxDiagram.model;
        }

        editorRef.current.subscribeToModelChange((model: UMLModel) => {
          const diagram = { ...reduxDiagram, model };
          dispatch(updateDiagramThunk(diagram));
        });

        setEditor!(editorRef.current);
        dispatch(setCreateNewEditor(false));
      }
    };

    initializeEditor();
  }, [containerRef.current, createNewEditor]);

  useEffect(() => {
    const previewDiagram = async () => {
      if (
        containerRef.current != null &&
        editorRef.current &&
        reduxDiagram.versions &&
        reduxDiagram.versions.length > 0 &&
        !createNewEditor
      ) {
        let editorOptions = structuredClone(options);
        editorOptions.readonly = previewedDiagramIndex !== -1;

        await editorRef.current.nextRender;
        editorRef.current.destroy();
        const editor = new ApollonEditor(containerRef.current!, editorOptions);
        await editor.nextRender;
        editorRef.current = editor;

        if (previewedDiagramIndex === -1 && reduxDiagram.model) {
          editorRef.current.model = reduxDiagram.model;

          editorRef.current.subscribeToModelChange((model: UMLModel) => {
            const diagram = { ...reduxDiagram, model };
            dispatch(updateDiagramThunk(diagram));
          });

          setEditor!(editorRef.current);
        } else if (reduxDiagram.versions[previewedDiagramIndex].model) {
          editorRef.current.model = reduxDiagram.versions[previewedDiagramIndex].model!;
        }
      }
    };

    previewDiagram();
  }, [previewedDiagramIndex]);

  const key = reduxDiagram?.id || uuid();

  return <ApollonContainer key={key} ref={containerRef} />;
};
