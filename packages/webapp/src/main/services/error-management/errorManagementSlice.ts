import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';  // Assuming you're using uuid to generate unique error IDs

// Define the error type
export type ApollonError = { 
  id: string; 
  headerText: string; 
  bodyText: string; 
};

// Define the initial state as an array of errors
const initialState: ApollonError[] = [];

// Create the error slice using Redux Toolkit's createSlice
const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    // Action to display an error
    displayError: {
      reducer: (state, action: PayloadAction<ApollonError>) => {
        state.push(action.payload);
      },
      prepare: (headerText: string, bodyText: string) => ({
        payload: {
          id: uuidv4(),  // Generate a unique ID for each error
          headerText,
          bodyText,
        },
      }),
    },
    // Action to dismiss an error by its ID
    dismissError: (state, action: PayloadAction<{ id: string }>) => {
      return state.filter((error) => error.id !== action.payload.id);
    },
  },
});

// Export actions to be used in components or thunks
export const { displayError, dismissError } = errorSlice.actions;

// Export the reducer to be used in the Redux store
export const errorReducer = errorSlice.reducer;
