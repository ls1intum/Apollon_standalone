import { DiagramPermission } from '../../../../shared/diagram-permission';
import { TokenService } from '../services/token-service';
import { Request } from 'express';
import { TokenDTO } from '../../../../shared/token-dto';

export type TokenCreationData = {
  ownerToken: string;
};

export class TokenResource {
  tokenService = new TokenService();

  async getAllTokensForOwnerToken(req: Request<TokenCreationData>, res: any) {
    const ownerToken = req.params.ownerToken;

    const token = await this.tokenService.getTokenByValue(ownerToken);
    if (token.permission !== DiagramPermission.EDIT) {
      res.status(401).send();
      return;
    }

    const allDiagramTokens = await this.tokenService.getTokensForOwnerToken(ownerToken);
    const dtos: TokenDTO[] = allDiagramTokens.map((token) => new TokenDTO(token.permission, token.value));

    res.json(dtos);
  }
}
