import { Injectable } from '@nestjs/common';
import { StorageService } from '../storage/storage.service';
import { Folder } from '../../model/folder';
import { FolderFactory } from './folder.factory';
import { User } from '../../model';

@Injectable()
export class FileManagerService {
  constructor(private readonly storageService: StorageService) {}

  public async createFolder(user: User, location: string, name: string): Promise<Folder> {
    const folder = FolderFactory.from({
      userId: user.id,
      organizationId: user.id,
      location,
      name,
    });

    await this.storageService.upload(folder.key);

    return folder;
  }
}
