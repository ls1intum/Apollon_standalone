import { DiagramView } from "./diagram-view";

export class TokenDTO {
  view: DiagramView;
  value: string;

  constructor(permission: DiagramView, value: string) {
    this.view = permission;
    this.value = value;
  }
}
