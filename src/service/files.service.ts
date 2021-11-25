import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const outputFolder = join(process.cwd(), 'fs-ics');

@Injectable()
export class FilesService {
  writeFileUser(fileName: string, buffer: Buffer): Promise<void> {
    const outputPath = join(outputFolder, fileName);
    return writeFile(outputPath, buffer);
  }

  registerDirectory(dirName: string): Promise<void> {
    const dirPath = join(outputFolder, dirName);
    if (!existsSync(dirPath)) {
      return mkdir(dirPath);
    }
  }
}
