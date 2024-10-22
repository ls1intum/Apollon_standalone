import { Reducer } from 'redux';
import { Actions } from '../actions';
import { VersionManagementActionType, VersionManagementState } from './version-management-types';

export const VersionManagementReducer: Reducer<VersionManagementState, Actions> = (
  state: VersionManagementState = { displaySidebar: false, previewedDiagramIndex: -1, versions: [] },
  action,
) => {
  switch (action.type) {
    case VersionManagementActionType.TOGGLE_SIDEBAR: {
      return {
        displaySidebar: !state.displaySidebar,
        previewedDiagramIndex: state.previewedDiagramIndex,
        versions: state.versions,
      };
    }
  }

  return state;
};
