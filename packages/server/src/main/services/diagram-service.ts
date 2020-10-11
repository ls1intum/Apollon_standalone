import { DiagramPermission } from '../../../../shared/diagram-permission';
import { TokenService } from './token-service';
import { getRepository, Repository } from 'typeorm';
import { Diagram } from '../entity/diagram';
import { Token } from '../entity/token';
import { DiagramDTO } from '../../../../shared/diagram-dto';

export class DiagramService {
  private tokenService: TokenService = new TokenService();
  private diagramRepository: Repository<Diagram> = getRepository(Diagram);

  /**
   * publishes the diagram and generates tokens for different permissions
   * @param diagramDTO
   * @returns editor token which gives full right to edit and share the diagram
   */
  publishDiagram(diagramDTO: DiagramDTO): Promise<Token[]> {
    const diagram: Diagram = new Diagram();
    diagram.diagram = diagramDTO;
    return this.diagramRepository.save(diagram).then((savedDiagram) => {
      return this.tokenService.createTokensForPermissions(savedDiagram, DiagramPermission.EDIT);
    });
  }

  getDiagramByToken(tokenValue: string): Promise<Diagram | undefined> {
    return this.diagramRepository
      .createQueryBuilder('diagram')
      .leftJoin('diagram.tokens', 'token')
      .where('token.value = :token', { token: tokenValue })
      .getOne();
  }

  async updateDiagram(diagram: DiagramDTO, tokenValue: string): Promise<Diagram> {
    const currentDiagram: Diagram | undefined = await this.getDiagramByToken(tokenValue);
    if (!currentDiagram) {
      throw Error('Cannot update diagram. No diagram for token exists');
    }
    const token: Token = await this.tokenService.getTokenByValue(tokenValue);
    const mergedDiagram = this.mergeDiagram(currentDiagram, diagram, token.permission);
    return this.diagramRepository.save(mergedDiagram);
  }

  private mergeDiagram(existingDiagram: Diagram, updatedDiagram: DiagramDTO, permission: DiagramPermission): Diagram {
    let mergedDiagram: Diagram = existingDiagram;
    switch (permission) {
      case DiagramPermission.EDIT:
        if (mergedDiagram.diagram.model && existingDiagram.diagram.model) {
          mergedDiagram.diagram.model.assessments = existingDiagram.diagram.model.assessments;
        }
        break;
      case DiagramPermission.FEEDBACK:
        if (mergedDiagram.diagram.model && updatedDiagram.model) {
          mergedDiagram.diagram.model.assessments = updatedDiagram.model.assessments;
        }
        break;
      default:
        throw Error('Unknown permission for diagram');
    }
    return mergedDiagram;
  }
}
