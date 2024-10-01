import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { UMLDiagramType, UMLModel } from '@ls1intum/apollon';
import { DiagramRepository } from './diagram-repository';
import { uuid } from '../../utils/uuid';
import moment, { Moment } from 'moment';
import { changeDiagramType } from '../editor-options/editorOptionSlice';

export type Diagram = {
  id: string;
  title: string;
  model?: UMLModel;
  lastUpdate: Moment;
};

// Define the initial state for the slice
export interface DiagramState {
  diagram: Diagram | null;
  loading: boolean;
  error: string | null;
}

const initialState: DiagramState = {
  diagram: null,
  loading: false,
  error: null,
};

// Thunk to handle creating a diagram
export const createDiagram = createAsyncThunk(
  'diagram/create',
  async (
    { diagramTitle, diagramType, template }: { diagramTitle: string; diagramType: UMLDiagramType; template?: UMLModel },
    { dispatch },
  ) => {
    const diagram: Diagram = {
      id: uuid(),
      title: diagramTitle,
      model: template,
      lastUpdate: moment(),
    };

    // Dispatch the update diagram action after creation
    dispatch(updateDiagram(diagram));
    dispatch(changeDiagramType(diagramType));

    return diagram;
  },
);

// Thunk to handle fetching a diagram from the server
export const fetchDiagramByToken = createAsyncThunk(
  'diagram/fetchByToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const diagram = await DiagramRepository.getDiagramFromServerByToken(token);
      return diagram;
    } catch (error) {
      return rejectWithValue('Failed to fetch diagram');
    }
  },
);

// Define the slice using Redux Toolkit
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
    },
  },
  extraReducers: (builder) => {
    builder
      // // Create Diagram
      // .addCase(createDiagram.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      // })
      // .addCase(createDiagram.fulfilled, (state, action: PayloadAction<Diagram>) => {
      //     state.loading = false;
      //     state.diagram = action.payload;
      // })
      // .addCase(createDiagram.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.error.message || 'Failed to create diagram';
      // })

      // // Update Diagram
      // .addCase(updateDiagram.pending, (state) => {
      //     state.loading = true;
      //     state.error = null;
      // })
      // .addCase(updateDiagram.fulfilled, (state, action: PayloadAction<Partial<Diagram>>) => {
      //     state.loading = false;
      //     if (state.diagram) {
      //         state.diagram = { ...state.diagram, ...action.payload, lastUpdate: moment() };
      //     }
      // })
      // .addCase(updateDiagram.rejected, (state, action) => {
      //     state.loading = false;
      //     state.error = action.error.message || 'Failed to update diagram';
      // })

      // Fetch Diagram
      .addCase(fetchDiagramByToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiagramByToken.fulfilled, (state, action: PayloadAction<Diagram | null>) => {
        state.loading = false;
        state.diagram = action.payload;
      })
      .addCase(fetchDiagramByToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
  selectors: {
    selectDiagram: (state: DiagramState) => state.diagram,
  },
});

export const { updateDiagram } = diagramSlice.actions;
export const { selectDiagram } = diagramSlice.selectors;

export const diagramReducer = diagramSlice.reducer;
