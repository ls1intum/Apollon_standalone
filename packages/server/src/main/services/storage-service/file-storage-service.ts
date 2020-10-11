import { StorageService } from './storage-service';
import { Diagram } from 'webapp/src/main/services/diagram/diagram-types';
import * as path from 'path';
import * as fs from 'fs';

const storagePath = path.resolve(`../../dist/test`);

export class FileStorageService implements StorageService {
  getDiagram(diagramId: string): Promise<Diagram> {
    const fileUrl = `${storagePath}/${diagramId}`;
    return fs.promises.readFile(fileUrl).then((buffer: Buffer) => {
      const diagram: Diagram = JSON.parse(buffer.toString('utf-8'));
      return diagram;
    });
  }

  saveDiagram(diagramId: string, diagram: Diagram): Promise<void> {
    const fileUrl = `${storagePath}/${diagramId}`;
    return fs.promises.writeFile(fileUrl, JSON.stringify(diagram), 'utf-8')
  }
}
