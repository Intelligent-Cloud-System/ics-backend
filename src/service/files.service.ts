import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import * as fsp from 'fs/promises';

import { Injectable } from '@nestjs/common';
import { User, File } from 'src/model';
import { FileRepository } from 'src/repository/file.repository';
import { ApplicationError } from 'src/shared/error/applicationError';

const STORAGE_PATH = path.join(process.cwd(), './storage/');

@Injectable()
export class FilesService {
  constructor(private readonly fileRepository: FileRepository) {}

  public async getListFiles(user: User): Promise<Array<File>> {
    const dirPath = this.resolveUserDir(user);
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = await this.fileRepository.getAllUserFiles(user.id);
    return files as File[];
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

  public async deleteFileUser(id: number, user: User): Promise<File> {
    const file = await this.fileRepository.getById(id);

    if (!(file && this.ensureUserFile(file, user))) {
      throw new FileNotExistsError('Not found file in user directory');
    }

    const deletedFile = await this.fileRepository.deleteFileById(file.id);
    if (await this.fileRepository.getById(deletedFile.id)) {
      throw new FileNotExistsError(`Can't delete file with id: ${id}`);
    }

    await fsp.unlink(file.filePath);
    return deletedFile;
  }

  public deleteFilesByIds(
    ids: Array<number>,
    user: User
  ): Promise<Array<File>> {
    const deletedFiles = ids.map((id) => this.deleteFileUser(id, user));
    return Promise.all(deletedFiles);
  }

  public async streamFileUser(id: number, user: User): Promise<fs.ReadStream> {
    const file = await this.fileRepository.getById(id);

    if (!(file && this.ensureUserFile(file, user))) {
      throw new FileNotExistsError('Not found file in user directory');
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
      throw new IllegalUserBehaviorError('Attempt at path traversal attack');
    }
    return filePath;
  }

  private ensureUserFile(file: File, user: User): boolean {
    return file.userId === user.id && fs.existsSync(file.filePath);
  }
}

export class FileNotExistsError extends ApplicationError {}
export class IllegalUserBehaviorError extends ApplicationError {}
