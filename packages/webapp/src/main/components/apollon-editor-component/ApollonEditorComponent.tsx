import { ApollonEditor, UMLModel } from '@ls1intum/apollon';
import React, { useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';
import { uuid } from '../../utils/uuid';

import { setCreateNewEditor, updateDiagramThunk, selectCreatenewEditor } from '../../services/diagram/diagramSlice';
import { ApollonEditorContext } from './apollon-editor-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { VersionManagementSidebar } from '../version-management-sidebar/version-management-sidebar';

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
  const editorContext = useContext(ApollonEditorContext);
  const setEditor = editorContext?.setEditor;

  useEffect(() => {
    const initializeEditor = async () => {
      if (containerRef.current != null && createNewEditor) {
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

  const key = reduxDiagram?.id || uuid();

  return <ApollonContainer key={key} ref={containerRef} >
    {/* This component should be in packages/webapp/src/main/application.tsx */}
    <VersionManagementSidebar/>
  </ApollonContainer>
};
