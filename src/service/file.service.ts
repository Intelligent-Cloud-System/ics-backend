import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import * as fsp from 'fs/promises';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { User, File } from 'src/model';
import { FileRepository } from 'src/repository/file.repository';
import { ApplicationError } from 'src/shared/error/applicationError';
import { FileConfig } from 'src/config/interfaces';

export interface FileLinkInfo {
  fileId: number;
  userId: number;
  path: string;
  expiresAt: Date;
}

@Injectable()
export class FileService {
  constructor(private readonly fileRepository: FileRepository, private readonly configService: ConfigService) {}

  // TODO: Create permission service
  public ensureFileBelongsToUser(file: File, user: User): void {
    if (file.userId !== user.id) {
      throw new FileDoesNotBelongToUser();
    }
  }

  public async getById(id: number): Promise<File> {
    const file = await this.fileRepository.getById(id);

    if (!file) {
      throw new FileNotExistsError();
    }

    return file;
  }

  public async getListFiles(user: User): Promise<Array<File>> {
    const dirPath = this.resolveUserDir(user);
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const files = await this.fileRepository.getAllUserFiles(user.id);
    return files as File[];
  }

  public async upsertFileUser(fileName: string, buffer: Buffer, user: User): Promise<File> {
    const dirPath = this.resolveUserDir(user);

    if (!fs.existsSync(dirPath)) await fsp.mkdir(dirPath);

    const currentPath = this.getFilePath(dirPath, fileName);
    await fsp.writeFile(currentPath, buffer);

    let file = await this.fileRepository.getByPath(currentPath);

    if (file) {
      return await this.fileRepository.updateFile(file.id, buffer.length);
    } else {
      file = new File(currentPath, buffer.length, user.id);
      return await this.fileRepository.insertFile(file);
    }
  }

  public async deleteFileUser(id: number, user: User): Promise<File> {
    const file = await this.getById(id);

    this.ensureFileBelongsToUser(file, user);

    // TODO: remove it and use deleteFilesByIds
    const deletedFile = await this.fileRepository.deleteFileById(file.id);
    await fsp.unlink(file.filePath);

    return deletedFile;
  }

  public deleteFilesByIds(ids: Array<number>, user: User): Promise<Array<File>> {
    const deletedFiles = ids.map((id) => this.deleteFileUser(id, user));
    return Promise.all(deletedFiles);
  }

  public getFileLink(file: File): { link: string; iv: string } {
    const fileConfig = this.configService.get<FileConfig>('file') as FileConfig;

    const expiresAt = this.getExpiresAtDate();
    const fileKey = [file.id, file.userId, file.filePath, expiresAt.toISOString()].join(fileConfig.separator);

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(fileConfig.algorithm, Buffer.from(fileConfig.secretKey), iv);

    let encrypted = cipher.update(fileKey);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return {
      link: encrypted.toString('hex'),
      iv: iv.toString('hex'),
    };
  }

  // TODO: make it more flexible
  private getExpiresAtDate(): Date {
    const dateNow = new Date();
    const oneMinute = 60 * 1000;

    return new Date(dateNow.getTime() + oneMinute);
  }

  private decodeLink(link: string, ivStr: string): FileLinkInfo {
    try {
      const fileConfig = this.configService.get<FileConfig>('file') as FileConfig;

      const iv = Buffer.from(ivStr, 'hex');
      const encryptedText = Buffer.from(link, 'hex');

      const decipher = crypto.createDecipheriv(fileConfig.algorithm, Buffer.from(fileConfig.secretKey), iv);

      let decrypted = decipher.update(encryptedText);
      decrypted = Buffer.concat([decrypted, decipher.final()]);

      const key = decrypted.toString();
      const [fileId, userId, path, expiresAt] = key.split(fileConfig.separator);

      if (!fileId || !userId || !path || !Date.parse(expiresAt)) {
        throw new UnableToParseLinkError();
      }

      return {
        fileId: parseInt(fileId),
        userId: parseInt(userId),
        path: path,
        expiresAt: new Date(expiresAt),
      };
    } catch (e) {
      throw new UnableToParseLinkError();
    }
  }

  public async getFileByLink(link: string, ivStr: string): Promise<File> {
    const linkInfo = this.decodeLink(link, ivStr);

    // TODO: Make facade for Date
    if (linkInfo.expiresAt.getTime() < new Date().getTime()) {
      throw new LinkHasExpiredError();
    }

    const file = await this.getById(linkInfo.fileId);

    if (file.userId !== linkInfo.userId || file.filePath !== linkInfo.path) {
      throw new WrongFileLinkError();
    }

    return file;
  }

  private resolveUserDir(user: User): string {
    const fileConfig = this.configService.get<FileConfig>('file') as FileConfig;
    const storageFolder = fileConfig.storageFolder;

    const { email } = user;
    const subDir = crypto.createHash('sha256').update(email).digest('hex');
    return path.join(process.cwd(), storageFolder, subDir);
  }

  private getFilePath(dirPath: string, fileName: string) {
    const filePath = path.join(dirPath, fileName);
    if (!filePath.startsWith(dirPath)) {
      throw new IllegalPathError('Attempt at path traversal attack');
    }
    return filePath;
  }
}

export class FileNotExistsError extends ApplicationError {}
export class UnableToParseLinkError extends ApplicationError {}
export class FileDoesNotBelongToUser extends ApplicationError {}
export class WrongFileLinkError extends ApplicationError {}
export class LinkHasExpiredError extends ApplicationError {}
export class IllegalPathError extends ApplicationError {}
