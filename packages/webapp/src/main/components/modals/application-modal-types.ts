export type ModalContentType = keyof typeof ModalContentType;

export const ModalContentType = {
  HelpModelingModal: 'HelpModelingModal',
  ImportDiagramModal: 'ImportDiagramModal',
  InformationModal: 'InformationModal',
  LoadDiagramModal: 'LoadDiagramModal',
  CreateDiagramModal: 'CreateDiagramModal',
  CreateDiagramFromTemplateModal: 'CreateDiagramFromTemplateModal',
  ShareModal: 'ShareModal',
} as const;

/**
 * type of ModalProps.size
 */
export type ModalSize = 'sm' | 'lg' | 'xl' | undefined;
