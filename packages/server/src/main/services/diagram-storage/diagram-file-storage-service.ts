import jsonpatch from 'fast-json-patch';
import type { Operation } from 'fast-json-patch';
import { promises as fs } from 'fs';
import { FileStorageService } from '../storage-service/file-storage-service';
import { DiagramDTO } from 'shared';
import { diagramStoragePath } from '../../constants';
import { DiagramStorageService } from './diagram-storage-service';
import { DiagramStorageRateLimiter, DiagramStorageRequest } from './diagram-storage-rate-limiter';

type SaveRequest = DiagramStorageRequest & {
  path: string;
};

/**
 * Service for storing diagrams on the file system.
 * Ensures the diagram storage directory exists before any I/O.
 */
export class DiagramFileStorageService implements DiagramStorageService {
  /**
   * How long should a substream for handling save requests of a particular
   * diagram be kept alive. Recommended value is larger that SAVE_INTERVAL.
   */
  static readonly SAVE_GROUP_TTL = 10_000;
  /**
   * How long should we wait for incoming save requests before saving the diagram.
   */
  static readonly SAVE_DEBOUNCE_TIME = 500;
  /**
   * How often should we save the diagram to ensure we don't lose data.
   * Saves might occur at a faster rate, this determines the maximum wait
   * between two saves (when there are save requests).
   */
  static readonly SAVE_INTERVAL = 3_000;

  /**
   * The file storage service to use for storing diagrams.
   */
  private fileStorageService: FileStorageService = new FileStorageService();

  /**
   * The rate limiter for saving diagrams.
   */
  private limiter: DiagramStorageRateLimiter<SaveRequest>;

  /**
   * Resolved once the storage directory is available.
   */
  private storageDirReady: Promise<void>;

  constructor() {
    this.storageDirReady = this.ensureStorageDir();
    this.limiter = new DiagramStorageRateLimiter<SaveRequest>(
      async (request) => {
        // TODO: add cancellable writes in FileStorageService; limiter can queue overlapping saves.
        await this.storageDirReady;
        await this.fileStorageService.saveContentToFile(request.path, JSON.stringify(request.diagramDTO));
      },
      async (request) => {
        // TODO: add cancellable writes in FileStorageService; limiter can queue overlapping saves.
        await this.storageDirReady;
        const diagram = await this.getDiagramByLink(request.token);
        if (!diagram) {
          throw Error(`File at ${request.path} does not exist`);
        }
        diagram.model = jsonpatch.applyPatch(diagram.model, request.patch).newDocument;
        await this.fileStorageService.saveContentToFile(request.path, JSON.stringify(diagram));
      },
      {
        saveInterval: DiagramFileStorageService.SAVE_INTERVAL,
        saveDebounceTime: DiagramFileStorageService.SAVE_DEBOUNCE_TIME,
        saveGroupTTL: DiagramFileStorageService.SAVE_GROUP_TTL,
      },
    );
  }

  async saveDiagram(diagramDTO: DiagramDTO, token: string, shared: boolean = true): Promise<string> {
    const path = this.getFilePathForToken(token);
    const exists = await this.diagramExists(token);

    if (exists && !shared) {
      throw Error(`File at ${path} already exists`);
    } else {
      if (exists) {
        this.limiter.request({ diagramDTO, token, path });
      } else {
        await this.storageDirReady;
        await this.fileStorageService.saveContentToFile(path, JSON.stringify(diagramDTO));
      }

      return token;
    }
  }

  async patchDiagram(token: string, patch: Operation[]): Promise<void> {
    const path = this.getFilePathForToken(token);
    const exists = await this.diagramExists(token);

    if (!exists) {
      throw Error(`File at ${path} does not exist`);
    } else {
      this.limiter.request({ patch, token, path });
    }
  }

  async diagramExists(token: string): Promise<boolean> {
    const path = this.getFilePathForToken(token);
    return this.fileStorageService.doesFileExist(path);
  }

  getDiagramByLink(token: string): Promise<DiagramDTO | undefined> {
    const path = this.getFilePathForToken(token);
    return this.storageDirReady
      .then(() => this.fileStorageService.getFileContent(path))
      .then((fileContent) => JSON.parse(fileContent) as DiagramDTO)
      .catch((error: NodeJS.ErrnoException) => {
        if (error?.code === 'ENOENT') {
          return undefined;
        }
        throw error;
      });
  }

  /**
   * Returns the file path for a diagram with given token.
   */
  private getFilePathForToken(token: string): string {
    return `${diagramStoragePath}/${token}.json`;
  }

  private async ensureStorageDir(): Promise<void> {
    await fs.mkdir(diagramStoragePath, { recursive: true });
  }
}
