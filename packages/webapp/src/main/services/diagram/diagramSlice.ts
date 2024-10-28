import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ApollonMode, Locale, Styles, UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { uuid } from '../../utils/uuid';
import { LocalStorageRepository } from '../local-storage/local-storage-repository';
import { DeepPartial } from 'redux';
import { localStorageDiagramPrefix, localStorageLatest } from '../../constant';

export type Diagram = {
  id: string;
  title: string;
  model?: UMLModel;
  lastUpdate: string;
  versions?: Diagram[];
  description?: string;
  token?: string;
};

export type EditorOptions = {
  type: UMLDiagramType;
  mode?: ApollonMode;
  readonly?: boolean;
  enablePopups?: boolean;
  enableCopyPaste?: boolean;
  theme?: DeepPartial<Styles>;
  locale: Locale;
  colorEnabled?: boolean;
};

export const defaultEditorOptions: EditorOptions = {
  type: UMLDiagramType.ClassDiagram,
  mode: ApollonMode.Modelling,
  readonly: false,
  enablePopups: true,
  enableCopyPaste: true,
  locale: Locale.en,
  colorEnabled: true,
};

const getInitialEditorOptions = (): EditorOptions => {
  const latestId = window.localStorage.getItem(localStorageLatest);
  const editorOptions = defaultEditorOptions;

  if (latestId) {
    const latestDiagram: Diagram = JSON.parse(window.localStorage.getItem(localStorageDiagramPrefix + latestId)!);
    editorOptions.type = latestDiagram?.model?.type ? latestDiagram.model.type : editorOptions.type;
  } else {
  }

  return editorOptions;
};

const getInitialDiagram = (): Diagram => {
  const latestId: string | null = window.localStorage.getItem(localStorageLatest);
  let diagram: Diagram;
  if (latestId) {
    const latestDiagram: Diagram = JSON.parse(window.localStorage.getItem(localStorageDiagramPrefix + latestId)!);
    diagram = latestDiagram;
  } else {
    diagram = { id: uuid(), title: 'UMLClassDiagram', model: undefined, lastUpdate: new Date().toISOString() };
  }

  return diagram;
};

const initialState = {
  diagram: getInitialDiagram(),
  editorOptions: getInitialEditorOptions(),
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

const diagramSlice = createSlice({
  name: 'diagram',
  initialState,
  reducers: {
    updateDiagram: (state, action: PayloadAction<Partial<Diagram>>) => {
      if (state.diagram) {
        state.diagram = { ...state.diagram, ...action.payload };
      }
    },
    createDiagram: (
      state,
      action: PayloadAction<{ title: string; diagramType: UMLDiagramType; template?: UMLModel }>,
    ) => {
      state.diagram = {
        id: uuid(),
        title: action.payload.title,
        model: action.payload.template,
        lastUpdate: new Date().toISOString(),
      };
      state.editorOptions.type = action.payload.diagramType;
      state.createNewEditor = true;
    },
    loadDiagram: (state, action: PayloadAction<Diagram>) => {
      state.diagram = action.payload;
      state.createNewEditor = true;
      state.editorOptions.type = action.payload.model?.type ?? 'ClassDiagram';
    },

    setCreateNewEditor: (state, action: PayloadAction<boolean>) => {
      state.createNewEditor = action.payload;
    },
    changeDiagramType: (state, action: PayloadAction<UMLDiagramType>) => {
      state.editorOptions.type = action.payload;
    },
    changeEditorMode: (state, action: PayloadAction<ApollonMode>) => {
      state.editorOptions.mode = action.payload;
    },
    changeReadonlyMode: (state, action: PayloadAction<boolean>) => {
      state.editorOptions.readonly = action.payload;
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
    selectDiagram: (state) => state.diagram,
    selectCreatenewEditor: (state) => state.createNewEditor,
  },
});

export const {
  updateDiagram,
  setCreateNewEditor,
  changeEditorMode,
  changeReadonlyMode,
  changeDiagramType,
  createDiagram,
  loadDiagram,
} = diagramSlice.actions;

export const { selectDiagram, selectCreatenewEditor } = diagramSlice.selectors;

export const diagramReducer = diagramSlice.reducer;
