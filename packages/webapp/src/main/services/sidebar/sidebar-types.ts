import { Action } from 'redux';

export type SidebarState = {
  displaySidebar: boolean;
};

export type SidebarActions = ToggleSidebarAction;

export const enum SidebarActionType {
  TOGGLE_SIDEBAR = '@@sidebar/toggle',
}

export type ToggleSidebarAction = Action<SidebarActionType.TOGGLE_SIDEBAR>;
