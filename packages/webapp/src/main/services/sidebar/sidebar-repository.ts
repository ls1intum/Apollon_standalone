import { SidebarActionType, ToggleSidebarAction } from './sidebar-types';

export const SidebarRepository = {
  toggleSidebar: (): ToggleSidebarAction => ({
    type: SidebarActionType.TOGGLE_SIDEBAR,
  }),
};
