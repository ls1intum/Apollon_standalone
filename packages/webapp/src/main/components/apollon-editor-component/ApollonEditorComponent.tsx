import { ApollonEditor, Patch, UMLModel } from '@ls1intum/apollon';
import React, { useEffect, useRef, useMemo, useContext } from 'react';
import styled from 'styled-components';
import { uuid } from '../../utils/uuid';

import { setCreateNewEditor, updateDiagramThunk, selectCreatenewEditor } from '../../services/diagram/diagramSlice';
import { ApollonEditorContext } from './apollon-editor-context';
import { useAppDispatch, useAppSelector } from '../store/hooks';

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

  const memoizedOptions = useMemo(() => options, [options.type, options.mode, options.readonly]);

  useEffect(() => {
    const initializeEditor = async () => {
      if (containerRef.current && createNewEditor && reduxDiagram && setEditor) {
        if (editorRef.current) {
          await editorRef.current.nextRender;
          editorRef.current.destroy();
        }
        editorRef.current = new ApollonEditor(containerRef.current, memoizedOptions);
        await editorRef.current?.nextRender;

        if (reduxDiagram.model) {
          editorRef.current.model = reduxDiagram.model;
        }
        editorRef.current.subscribeToModelChange((model: UMLModel) => {
          const diagram = { ...reduxDiagram, model };
          dispatch(updateDiagramThunk(diagram));
        });

        setEditor(editorRef.current);
        dispatch(setCreateNewEditor(false));
      }
    };

    initializeEditor();
  }, [containerRef.current, createNewEditor, setEditor]);

  const key = (reduxDiagram?.id || uuid()) + options.mode + options.type + options.readonly;

  return <ApollonContainer key={key} ref={containerRef} />;
};
