import { ApollonEditor } from '@ls1intum/apollon';
import { createContext } from 'react';

export type ApollonEditorContext = {
  editor?: ApollonEditor;
  setEditor: (editor: ApollonEditor) => void;
};

export const {
  Consumer: ApollonEditorConsumer,
  Provider: ApollonEditorProvider,
} = createContext<ApollonEditorContext | null>(null);
