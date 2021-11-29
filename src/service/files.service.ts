import { Injectable } from '@nestjs/common';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

const STORAGE_PATH = join(process.cwd(), './storage/');

@Injectable()
export class FilesService {
  async writeFileUser(fileName: string, buffer: Buffer): Promise<void> {
    const outputPath = join(STORAGE_PATH, fileName);
    
    

    return writeFile(outputPath, buffer);
  }

  registerDirectory(dirName: string): Promise<void> {
    const dirPath = join(STORAGE_PATH, dirName);
    if (!existsSync(dirPath)) {
      return mkdir(dirPath);
    }
  }
}
