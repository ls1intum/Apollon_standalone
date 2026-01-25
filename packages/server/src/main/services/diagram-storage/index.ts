export type { DiagramStorageService } from './diagram-storage-service';

import type { DiagramStorageService } from './diagram-storage-service';
import { DiagramRedisStorageService } from './diagram-redis-storage-service';
import { DiagramFileStorageService } from './diagram-file-storage-service';
import { MigratingStorageService } from './migrating-storage-service';

/**
 * Factory for creating a diagram storage service. Will determine
 * the correct service to use based on the environment.
 *
 * This is the storage strategy selector:
 * - Redis strategy when `APOLLON_REDIS_URL` is configured.
 * - File strategy when Redis is not configured (local/dev default).
 * - Optional migration strategy that reads from file but writes to Redis.
 */
export class DiagramStorageFactory {
  private static storageService?: DiagramStorageService;

  private static createStorageService(): DiagramStorageService {
    // A non-empty Redis URL switches the strategy from file to Redis storage.
    const redisUrl = process.env.APOLLON_REDIS_URL?.trim();
    if (redisUrl) {
      const redisStorage = new DiagramRedisStorageService({
        url: redisUrl,
        ttl: process.env.APOLLON_REDIS_DIAGRAM_TTL,
      });

      // Migration mode keeps old file-backed diagrams readable while moving new writes to Redis.
      if (process.env.APOLLON_REDIS_MIGRATE_FROM_FILE !== undefined) {
        return new MigratingStorageService({
          targetStorage: redisStorage,
          sourceStorage: new DiagramFileStorageService(),
        });
      } else {
        // Redis is the single source of truth when configured.
        return redisStorage;
      }
    }

    // Default strategy for local dev: persist diagrams in the filesystem.
    return new DiagramFileStorageService();
  }

  /**
   * Returns the instance for diagram storage service.
   * - If `APOLLON_REDIS_URL` is a non-empty string, it returns `DiagramRedisStorageService`.
   * - Otherwise, it returns `DiagramFileStorageService`.
   */
  public static getStorageService(): DiagramStorageService {
    if (this.storageService === undefined) {
      this.storageService = this.createStorageService();
    }
    return this.storageService;
  }
}
