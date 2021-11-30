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
  private dirPath;

  constructor(@inject(UserService) private readonly userService: UserService) {}

  async writeFileUser(fileName: string, buffer: Buffer): Promise<void> {
    const { email } = this.userService.getCurrentUser();
    const subDir = crypto.createHash('sha256').update(email).digest('hex');
    this.dirPath = path.join(STORAGE_PATH, subDir);

    if (!existsSync(this.dirPath)) {
      try {
        await fsp.mkdir(this.dirPath);
      } catch (err) {
        console.log(err);
      }
    }
    console.log();
  }
}
