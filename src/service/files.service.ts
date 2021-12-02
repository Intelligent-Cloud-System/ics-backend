import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';
import * as fsp from 'fs/promises';

import { Injectable } from '@nestjs/common';
import { User, File } from '../model';
import { FileRepository } from '../repository/file.repository';

const STORAGE_PATH = path.join(process.cwd(), './storage/');

@Injectable()
export class FilesService {

  constructor(private readonly fileRepository: FileRepository) {}

  async getListFiles(user: User) {
    const dirPath = this.resolveUserDir(user);
    if (!fs.existsSync(dirPath)) {
      return Promise.reject(new Error('Not found user directory'));
    }

    try {
      const files = await fsp.readdir(dirPath);

      return files;
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async writeFileUser(
    fileName: string,
    buffer: Buffer,
    user: User
  ): Promise<void> {
    const dirPath = this.resolveUserDir(user);

    if (!fs.existsSync(dirPath)) {
      try {
        await fsp.mkdir(dirPath);
      } catch (err) {
        console.log(err);
        return Promise.reject(err);
      }
    }

    const currentPath = path.join(dirPath, fileName);
    try {
      await fsp.writeFile(currentPath, buffer);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  streamFileUser(fileName: string, user: User): fs.ReadStream {
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
