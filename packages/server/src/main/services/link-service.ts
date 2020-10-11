import { createHash } from 'crypto';
import { DiagramAccess } from '../../../../shared/diagram-access';
import { uuid } from 'webapp/src/main/utils/uuid';

const serverSecret = '301e44f939178f35d1bf578d1f6b70e4';
const separator = '-';
const diagramIdLength = uuid().length;

export class LinkService {
  createLink(diagramId: string, permission: DiagramAccess): string {
    const hash = createHash('md5')
      .update(diagramId + serverSecret + permission)
      .digest('hex');
    return `${diagramId}${separator}${hash}${separator}${permission}`;
  }

  isLinkValid(link: string): boolean {
    // extract parts of link
    const permissionIndex = link.lastIndexOf(separator);
    const permission = link.substring(permissionIndex + 1);
    const diagramIdIndex = 0;
    const diagramId = link.substring(diagramIdIndex, diagramIdLength);
    // check validity
    const checkHash = this.createLink(diagramId, permission as DiagramAccess);
    return checkHash === link;
  }

  getDataPermissionFromLink(link: string): DiagramAccess {
    // extract diagram permission from link
    const permissionIndex = link.lastIndexOf(separator);
    const permission = link.substring(permissionIndex + 1);
    return permission as DiagramAccess;
  }

  getDiagramIdFromLink(link: string): string {
    // extract diagramId from link
    const diagramIdIndex = 0;
    return link.substring(diagramIdIndex, diagramIdLength);
  }
}
