import { VersionManagementActionType, ToggleSidebarAction } from './version-management-types';

export const VersionManagementRepository = {
  toggleSidebar: (): ToggleSidebarAction => ({
    type: VersionManagementActionType.TOGGLE_SIDEBAR,
  }),
};
