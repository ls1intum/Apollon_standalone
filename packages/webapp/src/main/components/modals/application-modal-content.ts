import { ComponentType } from 'react';
import { ModalContentType } from './application-modal-types.js';
import { HelpModelingModal } from './help-modeling-modal/help-modeling-modal.js';
import { ImportDiagramModal } from './import-diagram-modal/import-diagram-modal.js';
import { InformationModal } from './information-modal/information-modal.js';
import { LoadDiagramModal } from './load-diagram-modal/load-diagram-modal.js';
import { CreateDiagramModal } from './create-diagram-modal/create-diagram-modal.js';
import { CreateFromTemplateModal } from './create-diagram-from-template-modal/create-from-template-modal.js';
import { ShareModal } from './share-modal/share-modal.js';
import { CollaborationModal } from './collaboration-modal/collaboration-modal.js';

export const ApplicationModalContent: { [key in ModalContentType]: ComponentType<any> } = {
  [ModalContentType.HelpModelingModal]: HelpModelingModal,
  [ModalContentType.ImportDiagramModal]: ImportDiagramModal,
  [ModalContentType.InformationModal]: InformationModal,
  [ModalContentType.LoadDiagramModal]: LoadDiagramModal,
  [ModalContentType.CreateDiagramModal]: CreateDiagramModal,
  [ModalContentType.CreateDiagramFromTemplateModal]: CreateFromTemplateModal,
  [ModalContentType.ShareModal]: ShareModal,
  [ModalContentType.CollaborationModal]: CollaborationModal,
};
