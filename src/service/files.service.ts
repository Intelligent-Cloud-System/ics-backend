import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import * as fsp from 'fs/promises';

import { Injectable, Logger } from '@nestjs/common';
import { User, File } from '../model';
import { FileRepository } from '../repository/file.repository';
import { Result } from 'src/shared/util/util';
import { ApplicationError } from '../shared/error/applicationError';

const STORAGE_PATH = path.join(process.cwd(), './storage/');

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly fileRepository: FileRepository) {}

  public async getListFiles(user: User): Promise<Result<File>[]> {
    const dirPath = this.resolveUserDir(user);
    if (!fs.existsSync(dirPath)) {
      throw new ApplicationError('Not found user directory');
    }

    const files = await this.fileRepository.getAllUserFiles(user.id);
    return files;
  }

  public async writeFileUser(
    fileName: string,
    buffer: Buffer,
    user: User
  ): Promise<File> {
    const dirPath = this.resolveUserDir(user);

    if (!fs.existsSync(dirPath)) await fsp.mkdir(dirPath);

    const currentPath = path.join(dirPath, fileName);
    const file = new File(currentPath, buffer.length, user.id);

    if (await this.fileRepository.getByPath(file.filePath)) {
      throw new ApplicationError('Such a file already exists');
    }

    await fsp.writeFile(currentPath, buffer);
    const writtenFile = await this.fileRepository.insertFile(file);
    return writtenFile;
  }

  public streamFileUser(fileName: string, user: User): fs.ReadStream {
    const dirPath = this.resolveUserDir(user);
    const filePath = path.join(dirPath, fileName);
    if (!fs.existsSync(filePath)) {
      throw new ApplicationError('Not found file in user directory');
    }

    const file = fs.createReadStream(filePath);
    return file;
  }

  private resolveUserDir(user: User): string {
    const { email } = user;
    const subDir = crypto.createHash('sha256').update(email).digest('hex');
    return path.join(STORAGE_PATH, subDir);
  }
}
