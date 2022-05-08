import * as path from 'path';
import { Injectable } from '@nestjs/common';

import { StorageService } from '../storage/storage.service';
import { Folder } from '../../model/folder';
import { FolderFactory } from './folder.factory';
import { File, User } from '../../model';

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

  public async getContent(user: User, location: string): Promise<{ files: Array<File>; folders: Array<Folder> }> {
    const prefix = `organization/${user.id}/user/${user.id}`;
    const wLocation = location.endsWith('/') ? location : `${location}/`;
    const userLocation = path.join(prefix, wLocation);

    const objects = await this.storageService.getFolderObjects(userLocation, '/');

    const files =
      objects.Contents?.map((content) => {
        return new File(content.Key as string, content.Size, content.LastModified);
      }) || [];
    const folders =
      objects.CommonPrefixes?.map((commonPrefix) => {
        return new Folder(commonPrefix.Prefix as string);
      }) || [];

    return { files, folders };
  }
}
