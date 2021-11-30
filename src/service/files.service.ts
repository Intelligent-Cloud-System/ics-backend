import * as crypto from 'crypto';
import * as path from 'path';
import * as fsp from 'fs/promises';
import { existsSync } from 'fs';
import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import { UserService } from './user.service';

const STORAGE_PATH = path.join(process.cwd(), './storage/');

@provide(FilesService)
export class FilesService {

  constructor(@inject(UserService) private readonly userService: UserService) {}

  async writeFileUser(fileName: string, buffer: Buffer): Promise<void> {
    const { email } = this.userService.getCurrentUser();
    const subDir = crypto.createHash('sha256').update(email).digest('hex');
    const dirPath = path.join(STORAGE_PATH, subDir);

    if (!existsSync(dirPath)) {
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
}
