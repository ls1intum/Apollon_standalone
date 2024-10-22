import { Action } from 'redux';
import { Diagram } from '../diagram/diagram-types';

export type VersionManagementState = {
  displaySidebar: boolean;
  previewedDiagramIndex: number;
  versions: Diagram[];
};

export type VersionManagementActions = ToggleSidebarAction;

export const enum VersionManagementActionType {
  TOGGLE_SIDEBAR = '@@sidebar/toggle',
}

export type ToggleSidebarAction = Action<VersionManagementActionType.TOGGLE_SIDEBAR>;
