import * as fs from 'fs';

export class FileStorageService {
  getFileContent(path: string): Promise<string> {
    return fs.promises.readFile(path).then((buffer: Buffer) => {
      return buffer.toString('utf-8');
    });
  }

  saveContentToFile(path: string, content: string): Promise<void> {
    return fs.promises.writeFile(path, content, 'utf-8');
  }

  doesFileExist(path: string): Promise<boolean> {
    return fs.promises
      .stat(path)
      .then((stat) => stat.isFile() || stat.isDirectory())
      .catch(() => {
        return false;
      });
  }
}
