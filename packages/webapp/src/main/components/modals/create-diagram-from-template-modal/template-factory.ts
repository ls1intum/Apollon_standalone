import { Template, TemplateType } from "./template-types";

export interface TemplateFactory {
  getTemplate(templateType: TemplateType): Template;
}
