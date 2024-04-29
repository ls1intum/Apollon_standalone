import { Operation } from 'fast-json-patch';
import { RedisClientType, createClient } from 'redis';

import { DiagramDTO } from '../../../../../shared/src/main/diagram-dto';
import { DiagramStorageService } from './diagram-storage-service';
import { DiagramStorageRateLimiter, DiagramStorageRequest } from './diagram-storage-rate-limiter';
import { applyPatchToRedisValue } from './redis-patch';

type SaveRequest = DiagramStorageRequest & {
  key: string;
}


/**
 * Diagram storage service that uses Redis as a storage backend.
 */
export class DiagramRedisStorageService implements DiagramStorageService {
  /**
   * How long should a substream for handling save requests of a particular
   * diagram be kept alive. Recommended value is larger that SAVE_INTERVAL.
   */
  static readonly SAVE_GROUP_TTL = 10_000;
  /**
   * How long should we wait for incoming save requests before saving the diagram.
   */
  static readonly SAVE_DEBOUNCE_TIME = 10;
  /**
   * How often should we save the diagram to ensure we don't lose data.
   * Saves might occur at a faster rate, this determines the maximum wait
   * between two saves (when there are save requests).
   */
  static readonly SAVE_INTERVAL = 100;

  /**
   * The Redis client to use for storing diagrams.
   */
  redisClient: Promise<RedisClientType>;

  /**
   * The rate limiter for saving diagrams.
   */
  private limiter: DiagramStorageRateLimiter<SaveRequest>;

  /**
   * @param redisUrl the URL to connect to the Redis server. see
   *               [the documentation of `redis` package](https://www.npmjs.com/package/redis#usage)
   *               for more information on the URL format.
   */
  constructor(redisUrl?: string) {
    this.redisClient = this.createRedisClient(redisUrl);
    this.limiter = new DiagramStorageRateLimiter<SaveRequest>(
      async (request) => {
        const client = await this.redisClient;
        await client.json.set(request.key, '$', request.diagramDTO as any);
      },
      async (request) => {
        const client = await this.redisClient;
        await applyPatchToRedisValue(client, request.key, request.patch, '$.model');
      },
      {
        saveInterval: DiagramRedisStorageService.SAVE_INTERVAL,
        saveDebounceTime: DiagramRedisStorageService.SAVE_DEBOUNCE_TIME,
        saveGroupTTL: DiagramRedisStorageService.SAVE_GROUP_TTL,
      },
    );
  }

  async saveDiagram(diagramDTO: DiagramDTO, token: string, shared: boolean = false): Promise<string> {
    const key = this.getKeyForToken(token);
    const exists = await this.diagramExists(key);

    if (exists && !shared) {
      throw Error(`Diagram at ${key} already exists`);
    } else {
      if (exists) {
        this.limiter.request({ diagramDTO, token, key });
      } else {
        const client = await this.redisClient;
        const res = await client.json.set(key, '$', diagramDTO as any);
        console.log(res);
      }

      return token;
    }
  }

  async patchDiagram(token: string, patch: Operation[]): Promise<void> {
    const key = this.getKeyForToken(token);
    const exists = await this.diagramExists(token);

    if (!exists) {
      throw Error(`Diagram at ${key} does not exist`);
    } else {
      this.limiter.request({ patch, token, key });
    }
  }

  async diagramExists(token: string): Promise<boolean> {
    const key = this.getKeyForToken(token);
    const client = await this.redisClient;

    return await client.exists(key) > 0;
  }

  async getDiagramByLink(token: string): Promise<DiagramDTO | undefined> {
    const key = this.getKeyForToken(token);
    const client = await this.redisClient;
    try {
      const diagram = await client.json.get(key);

      if (!diagram) {
        return undefined;
      }

      return diagram as any as DiagramDTO;
    } catch (err) {
      console.log(`Can't load diagram ${key}:: `, err);
      return undefined;
    }
  }

  /**
   * Returns the redis key to use for a diagram with given token.
   */
  private getKeyForToken(token: string): string {
    return `apollon_diagram:${token}`;
  }

  /**
   * Creates a Redis client and connects to the server.
   */
  private async createRedisClient(url?: string): Promise<RedisClientType> {
    try {
      console.log('Creating Redis client, connecting to:', url);
      const client: RedisClientType = createClient(url ? { url } : undefined);
      await client.connect();
      console.log('Redis client connected');

      return client;
    } catch (err) {
      console.log('Failed to create Redis client', err);
      throw err;
    }
  }
}
