import { Diagram, DiagramState } from '../../services/diagram/diagramSlice';
import { EditorOptions } from '../../services/editor-options/editor-options-types';
import { ApollonError } from '../../services/error-management/error-types';
import { ModalState } from '../../services/modal/modal-types';
import { ShareState } from '../../services/share/share-types';

export interface ApplicationState {
  diagram: DiagramState;
  editorOptions: EditorOptions;
  errors: ApollonError[];
  modal: ModalState;
  share: ShareState;
}
