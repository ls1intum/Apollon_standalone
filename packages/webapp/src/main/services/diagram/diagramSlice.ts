import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { uuid } from '../../utils/uuid';
import { changeDiagramType } from '../editor-options/editorOptionSlice';
import { LocalStorageRepository } from '../local-storage/local-storage-repository';

export type Diagram = {
  id: string;
  title: string;
  model?: UMLModel;
  lastUpdate: string;
};

export interface DiagramState {
  diagram: Diagram | null;
  loading: boolean;
  error: string | null;
  createNewEditor: boolean;
}

const initialState: DiagramState = {
  diagram: null,
  loading: false,
  error: null,
  createNewEditor: true,
};

export const updateDiagramThunk = createAsyncThunk(
  'diagram/updateWithLocalStorage',
  async (diagram: Partial<Diagram>, { dispatch }) => {
    await dispatch(updateDiagram(diagram));
  },
);

export const createDiagram = createAsyncThunk(
  'diagram/create',
  async (
    { diagramTitle, diagramType, template }: { diagramTitle: string; diagramType: UMLDiagramType; template?: UMLModel },
    { dispatch },
  ) => {
    dispatch(setCreateNewEditor(true));
    const diagram: Diagram = {
      id: uuid(),
      title: diagramTitle,
      model: template,
      lastUpdate: new Date().toISOString(),
    };

    dispatch(updateDiagramThunk(diagram));
    dispatch(changeDiagramType(diagramType));

    return diagram;
  },
);

const diagramSlice = createSlice({
  name: 'diagram',
  initialState,
  reducers: {
    updateDiagram: (state, action: PayloadAction<Partial<Diagram>>) => {
      if (state.diagram) {
        state.diagram = { ...state.diagram, ...action.payload };
      }
    },
    createDiagram: (state, action: PayloadAction<string>) => {
      state.diagram!.id = action.payload;
      state.loading = true;
    },
    setCreateNewEditor: (state, action: PayloadAction<boolean>) => {
      state.createNewEditor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateDiagramThunk.fulfilled, (state) => {
      if (state.diagram) {
        LocalStorageRepository.storeDiagram(state.diagram);
        state.loading = false;
      }
    });
  },

  selectors: {
    selectDiagram: (state: DiagramState) => state.diagram,
    selectCreatenewEditor: (state: DiagramState) => state.createNewEditor,
  },
});

export const { updateDiagram, setCreateNewEditor } = diagramSlice.actions;
export const { selectDiagram, selectCreatenewEditor } = diagramSlice.selectors;

export const diagramReducer = diagramSlice.reducer;
