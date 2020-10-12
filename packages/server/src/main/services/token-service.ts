import { createHash } from 'crypto';
import { DiagramPermission } from '../../../../shared/diagram-permission';
import { Diagram } from '../entity/diagram';
import { getRepository, Repository } from 'typeorm';
import { Token } from '../entity/token';

export class TokenService {
  private tokenRepository: Repository<Token>;

  constructor() {
    this.tokenRepository = getRepository(Token);
  }
  /**
   * creates tokens, one token for each permission
   * @param diagram
   * @param permissions
   */
  createTokensForPermissions(diagram: Diagram, ...permissions: DiagramPermission[]): Promise<Token[]> {
    if (!permissions) {
      throw Error('You have to specify permissions if you want to create tokens');
    }
    const tokens: Token[] = permissions.map((permission) => {
      return this.createToken(diagram, permission);
    });
    return this.tokenRepository.save(tokens);
  }

  private createToken(diagram: Diagram, permission: DiagramPermission): Token {
    const token = new Token();
    token.diagram = diagram;
    token.permission = permission;
    const randomString = Math.random().toString(36);
    const value = createHash('md5')
      .update(randomString + permission)
      .digest('hex');
    token.value = value;
    return token;
  }

  async getTokenByValue(tokenValue: string): Promise<Token> {
    const token = await this.tokenRepository.findOneOrFail({ value: tokenValue });
    return token;
  }

  async getTokensForOwnerToken(ownerToken: string): Promise<Token[]> {
    // TODO: get all tokens
    return this.tokenRepository
      .createQueryBuilder('token')
      .leftJoin('token.diagram', 'diagram')
      .leftJoinAndSelect('diagram.tokens', 'token1')
      .where('token.value = :tokenValue', { tokenValue: ownerToken })
      .getMany();
  }
}
