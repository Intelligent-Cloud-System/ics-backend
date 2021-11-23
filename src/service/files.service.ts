import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class FilesService {
  writeFileUser(fileName: string, buffer: Buffer): Promise<any> {
    const outputPath = join(process.cwd(), 'fs-ics', fileName);
    return writeFile(outputPath, buffer);
  }
}
