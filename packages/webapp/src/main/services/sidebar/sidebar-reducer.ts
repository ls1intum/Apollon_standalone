import { Reducer } from 'redux';
import { Actions } from '../actions';
import { SidebarActionType, SidebarState } from './sidebar-types';

export const SidebarReducer: Reducer<SidebarState, Actions> = (
  state: SidebarState = { displaySidebar: false },
  action,
) => {
  switch (action.type) {
    case SidebarActionType.TOGGLE_SIDEBAR: {
      return {
        displaySidebar: !state.displaySidebar,
      };
    }
  }

  return state;
};
