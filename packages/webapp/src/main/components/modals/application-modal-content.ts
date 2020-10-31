import { ComponentType } from 'react';
import { ModalContentType } from './application-modal-types';
import { HelpModelingModal } from './help-modeling-modal/help-modeling-modal';
import { ImportDiagramModal } from './import-diagram-modal/import-diagram-modal';
import { InformationModal } from './information-modal/information-modal';
import { LoadDiagramModal } from './load-diagram-modal/load-diagram-modal';
import { CreateDiagramModal } from './create-diagram-modal/create-diagram-modal';
import { DiagramFromTemplateModal } from './diagram-from-template-modal/diagram-from-template-modal';
import { ShareModal } from './share-modal/share-modal';

export const ApplicationModalContent: { [key in ModalContentType]: ComponentType<any> } = {
  [ModalContentType.HelpModelingModal]: HelpModelingModal,
  [ModalContentType.ImportDiagramModal]: ImportDiagramModal,
  [ModalContentType.InformationModal]: InformationModal,
  [ModalContentType.LoadDiagramModal]: LoadDiagramModal,
  [ModalContentType.CreateDiagramModal]: CreateDiagramModal,
  [ModalContentType.CreateDiagramFromTemplateModal]: DiagramFromTemplateModal,
  [ModalContentType.ShareModal]: ShareModal,
};
