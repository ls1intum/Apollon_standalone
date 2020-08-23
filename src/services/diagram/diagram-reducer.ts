import { Reducer } from "redux";
import { Actions } from "../actions";
import { Diagram, DiagramActionTypes } from "./diagram-types";

export const DiagramReducer: Reducer<Diagram | null, Actions> = (state, action) => {
  switch (action.type) {
    case DiagramActionTypes.UPDATE_DIAGRAM: {
      const { payload } = action;
      // merges standalone state with apollon-editor state
      return {
        ...state,
        ...payload.values,
      } as Diagram;
    }
  }

  return !state ? null : state;
};
