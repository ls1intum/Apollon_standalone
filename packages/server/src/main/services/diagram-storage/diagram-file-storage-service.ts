import { debounceTime, from, groupBy, mergeMap, Subject, switchMap } from 'rxjs';
import { auditDebounceTime } from 'audit-debounce';
import { applyPatch, Operation } from 'fast-json-patch';

import { FileStorageService } from '../storage-service/file-storage-service';
import { DiagramDTO } from '../../../../../shared/src/main/diagram-dto';
import { diagramStoragePath } from '../../constants';
import { DiagramStorageService } from './diagram-storage-service';

interface SaveRequest {
  diagramDTO?: DiagramDTO;
  patch?: Operation[];
  token: string;
  path: string;
}

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

  private fileStorageService: FileStorageService = new FileStorageService();

  //
  // this router handles saving of diagrams.
  // requests for saving diagrams can come at any time, and might
  // need some pacing to avoid overloading the file system (which results in corrupted files.
  //
  private router = new Subject<SaveRequest>();

  constructor() {
    //
    // I do realize complex rxjs pipelines are not the easiest to read.
    // so I will try to explain what is going on here.
    //
    this.router
      .pipe(
        //
        // first, we group requests by token, since we don't want
        // save requests for one token to affect requests of another
        // token on the server (each token relates to a different diagram)
        //
        groupBy((request) => request.token, {
          //
          // this duration selector determines how long the "group" stream
          // should be kept alive. without a duration selector, these "groups"
          // will be kept alive indefinitely, clogging up memory.
          //
          duration: (group) =>
            group.pipe(
              //
              // indicates that each group should be kept alive
              // SAVE_GROUP_TTL milliseconds after the last save request for that
              // group. note that the diagram might still be worked on,
              // but we can create a new group for new save requests if they happen.
              //
              debounceTime(DiagramFileStorageService.SAVE_GROUP_TTL),
            ),
        }),
        //
        // with `mergeMap()`, we will operate on each "group" independently
        // and then merge the results back into a singular stream.
        //
        mergeMap((group) =>
          group.pipe(
            //
            // this will try to wait for SAVE_DEBOUNCE_TIME milliseconds
            // after each incoming save request before saving the diagram.
            // since that can be too long if save requests are incoming frequently,
            // we will also save the diagram every SAVE_INTERVAL milliseconds to ensure
            // we don't lose data (in case the server process stops, for example due to a crash).
            //
            auditDebounceTime(DiagramFileStorageService.SAVE_DEBOUNCE_TIME, DiagramFileStorageService.SAVE_INTERVAL),
            //
            // since saving is an async operation itself, we need to use `switchMap()`
            // to ensure only a single save operation is running at any given time.
            //
            // FIXME: this requires cancellation  mechanism on file storage, which is not implemented yet.
            // read [this](https://stackoverflow.com/questions/74529131/node-js-how-to-cancel-a-writefile-operation)
            // to learn how to cancel a write operation.
            //
            switchMap((request) => {
              if (request.diagramDTO) {
                return from(
                  this.fileStorageService.saveContentToFile(request.path, JSON.stringify(request.diagramDTO)),
                );
              } else if (request.patch) {
                const patch = request.patch;
                return from(
                  (async () => {
                    const diagram = await this.getDiagramByLink(request.token);
                    diagram!.model = applyPatch(diagram!.model, patch).newDocument;
                    return this.fileStorageService.saveContentToFile(request.path, JSON.stringify(diagram));
                  })(),
                );
              } else {
                return from(Promise.resolve());
              }
            }),
          ),
        ),
      )
      .subscribe();
  }

  async saveDiagram(diagramDTO: DiagramDTO, token: string, shared: boolean = false): Promise<string> {
    // alpha numeric token with length = tokenLength
    const path = this.getFilePathForToken(token);
    const exists = await this.diagramExists(path);

    if (exists && !shared) {
      throw Error(`File at ${path} already exists`);
    } else {
      if (exists) {
        this.router.next({ diagramDTO, token, path });
      } else {
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
      this.router.next({ patch, token, path });
    }
  }

  async diagramExists(token: string): Promise<boolean> {
    const path = this.getFilePathForToken(token);
    return this.fileStorageService.doesFileExist(path);
  }

  getDiagramByLink(token: string): Promise<DiagramDTO | undefined> {
    const path = this.getFilePathForToken(token);
    return this.fileStorageService.getFileContent(path).then((fileContent) => JSON.parse(fileContent) as DiagramDTO);
  }

  private getFilePathForToken(token: string): string {
    return `${diagramStoragePath}/${token}.json`;
  }
}
