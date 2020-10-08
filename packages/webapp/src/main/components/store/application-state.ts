import { Diagram } from '../../services/local-storage/local-storage-types';
import { EditorOptions } from '../../services/editor-options/editor-options-types';
import { ApollonError } from '../../services/error-management/error-types';

export interface ApplicationState {
  diagram: Diagram | null;
  editorOptions: EditorOptions;
  errors: ApollonError[];
}