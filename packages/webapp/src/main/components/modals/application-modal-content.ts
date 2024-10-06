import { ModalContentProps, ModalContentType } from './application-modal-types';
import { HelpModelingModal } from './help-modeling-modal/help-modeling-modal';
import { ImportDiagramModal } from './import-diagram-modal/import-diagram-modal';
import { InformationModal } from './information-modal/information-modal';
import { LoadDiagramModal } from './load-diagram-modal/load-diagram-modal';
import { CreateDiagramModal } from './create-diagram-modal/create-diagram-modal';
import { CreateFromTemplateModal } from './create-diagram-from-template-modal/create-from-template-modal';
import { ShareModal } from './share-modal/share-modal';
import { CollaborationModal } from './collaboration-modal/collaboration-modal';

export const ApplicationModalContent: { [key in ModalContentType]: React.FC<ModalContentProps> } = {
  [ModalContentType.HelpModelingModal]: HelpModelingModal,
  [ModalContentType.ImportDiagramModal]: ImportDiagramModal,
  [ModalContentType.InformationModal]: InformationModal,
  [ModalContentType.LoadDiagramModal]: LoadDiagramModal,
  [ModalContentType.CreateDiagramModal]: CreateDiagramModal,
  [ModalContentType.CreateDiagramFromTemplateModal]: CreateFromTemplateModal,
  [ModalContentType.ShareModal]: ShareModal,
  [ModalContentType.CollaborationModal]: CollaborationModal,
};
