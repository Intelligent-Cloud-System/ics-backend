import { Injectable } from '@nestjs/common';
import { writeFile } from 'fs/promises';

@Injectable()
export class FilesService {
  writeFileUser(fileName: string, buffer: Buffer): Promise<any> {
    return writeFile(`./../../fs-ics/${fileName}`, buffer);
  }
}
