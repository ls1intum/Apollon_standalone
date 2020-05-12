import { Diagram } from '../../services/local-storage/local-storage-types';
import { EditorOptions } from '../../services/editor-options/editor-options-types';

export interface ApplicationState {
  diagram: Diagram | null;
  editorOptions: EditorOptions;
}
