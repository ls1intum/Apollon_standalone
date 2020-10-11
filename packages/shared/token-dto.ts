import { DiagramPermission } from './diagram-permission';

export class TokenDTO {
  permission: DiagramPermission;
  value: string;

  constructor(permission: DiagramPermission, value: string) {
    this.permission = permission;
    this.value = value;
  }
}
