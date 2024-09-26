import { EditorOptions } from '../../services/editor-options/editor-options-types';
import { ApollonError } from '../../services/error-management/error-types';
import { ModalState } from '../../services/modal/modal-types';
import { Diagram } from '../../services/diagram/diagram-types';
import { ShareState } from '../../services/share/share-types';
import { SidebarState } from '../../services/sidebar/sidebar-types';

export interface ApplicationState {
  diagram: Diagram | null;
  editorOptions: EditorOptions;
  errors: ApollonError[];
  modal: ModalState;
  share: ShareState;
  sidebar: SidebarState;
}
