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

  public async upsertFileUser(
    fileName: string,
    buffer: Buffer,
    user: User
  ): Promise<File> {
    const dirPath = this.resolveUserDir(user);

    if (!fs.existsSync(dirPath)) await fsp.mkdir(dirPath);

    const currentPath = this.getFilePath(dirPath, fileName);

    const file = await this.fileRepository.getByPath(currentPath);
    await fsp.writeFile(currentPath, buffer);
    if (file?.id) {
      return await this.fileRepository.updateFile(file.id, buffer.length);
    }

    return await this.fileRepository.insertFile(
      new File(currentPath, buffer.length, user.id)
    );
  }

  public async deleteFileUser(id: number, user: User) {
    const file = await this.fileRepository.getById(id);

    if (!(file && this.ensureUserFile(file, user))) {
      throw new ApplicationError('Not found file in user directory');
    }

    const deletedFile = await this.fileRepository.deleteFileById(file.id);
    if (await this.fileRepository.getById(deletedFile.id)) {
      throw new ApplicationError(`Can't delete file with id: ${id}`);
    }

    await fsp.unlink(file.filePath);
    return deletedFile;
  }

  public async streamFileUser(id: number, user: User): Promise<fs.ReadStream> {
    const file = await this.fileRepository.getById(id);

    if (!(file && this.ensureUserFile(file, user))) {
      throw new ApplicationError('Not found file in user directory');
    }

    const stream = fs.createReadStream(file.filePath);
    return stream;
  }

  private resolveUserDir(user: User): string {
    const { email } = user;
    const subDir = crypto.createHash('sha256').update(email).digest('hex');
    return path.join(STORAGE_PATH, subDir);
  }

  private getFilePath(dirPath: string, fileName: string) {
    const filePath = path.join(dirPath, fileName);
    if (!filePath.startsWith(dirPath)) {
      throw new ApplicationError('Attempt at path traversal attack');
    }
    return filePath;
  }

  private ensureUserFile(file: File, user: User): boolean {
    return file.userId === user.id && fs.existsSync(file.filePath);
  }
}
