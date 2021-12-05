import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import * as fsp from 'fs/promises';

import { Injectable, Logger } from '@nestjs/common';
import { User, File } from '../model';
import { FileRepository } from '../repository/file.repository';
import { Result } from 'src/shared/util/util';

const STORAGE_PATH = path.join(process.cwd(), './storage/');

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);

  constructor(private readonly fileRepository: FileRepository) {}

  public async getListFiles(user: User): Promise<Result<File>[]> {
    const dirPath = this.resolveUserDir(user);
    if (!fs.existsSync(dirPath)) {
      return Promise.reject(new Error('Not found user directory'));
    }

    try {
      const files = await this.fileRepository.getAllUserFiles(user.id);
      return files;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async writeFileUser(
    fileName: string,
    buffer: Buffer,
    user: User
  ): Promise<File> {
    const dirPath = this.resolveUserDir(user);

    if (!fs.existsSync(dirPath)) {
      try {
        await fsp.mkdir(dirPath);
      } catch (err) {
        this.logger.log(err);
        return Promise.reject(err);
      }
    }

    const currentPath = path.join(dirPath, fileName);
    const file = new File(currentPath, buffer.length, user.id);

    try {
      await fsp.writeFile(currentPath, buffer);
      const writtenFile = await this.fileRepository.insertFile(file);
      return writtenFile;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public streamFileUser(fileName: string, user: User): fs.ReadStream {
    const dirPath = this.resolveUserDir(user);
    const filePath = path.join(dirPath, fileName);
    if (!fs.existsSync(filePath)) {
      throw new Error('Not found file in user directory');
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
