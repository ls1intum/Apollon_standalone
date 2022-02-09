import { EditorOptions } from '../../services/editor-options/editor-options-types.js';
import { ApollonError } from '../../services/error-management/error-types.js';
import { ModalState } from '../../services/modal/modal-types.js';
import { Diagram } from '../../services/diagram/diagram-types.js';
import { ShareState } from '../../services/share/share-types.js';

export interface ApplicationState {
  diagram: Diagram | null;
  editorOptions: EditorOptions;
  errors: ApollonError[];
  modal: ModalState;
  share: ShareState;
}
