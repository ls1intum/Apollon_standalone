import { BASE_URL } from '../../constant';
import { TokenDTO } from '../../../../../shared/token-dto';

const resourceUrl = `${BASE_URL}/tokens`;

export const TokenRepository = {
  getTokensForOwnerToken: (ownerToken: string): Promise<TokenDTO[]> => {
    const url = `${resourceUrl}/${ownerToken}/allTokens`;
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json());
  },
};
