import * as path from 'path';
import { Injectable } from '@nestjs/common';

import { StorageService } from '../storage/storage.service';
import { Folder } from '../../model/folder';
import { FolderFactory } from './folder.factory';
import { File, User } from '../../model';
import { FileFactory } from './file.factory';
import { DeleteFileRequest, DeleteFolderRequest, UploadFileRequest } from 'src/interface/apiRequest';
import { DeleteFileResponse, DeleteFolderResponse, UploadFileResponse } from 'src/interface/apiResponse';
import { checkForUpwardDir } from 'src/shared/util/file.utils';
import { ApplicationError } from 'src/shared/error/applicationError';

@Injectable()
export class FileManagerService {
  constructor(private readonly storageService: StorageService) {}

  private static getUserLocation(user: User, location: string, isFile?: boolean): string {
    const prefix = `organization/${user.id}/user/${user.id}`;
    const wLocation = location.endsWith('/') || isFile ? location : `${location}/`;
    return path.posix.join(prefix, wLocation);
  }

  public async createFolder(user: User, location: string, name: string): Promise<Folder> {
    if (checkForUpwardDir(location)) throw new UpwardDirectoryError('Trying to reach a directory above root');

    const folder = FolderFactory.from({
      userId: user.id,
      organizationId: user.id,
      location,
      name,
    });

    await this.storageService.upload(folder.key);

    return folder;
  }

  public async uploadFiles(user: User, body: UploadFileRequest): Promise<UploadFileResponse> {
    const links = Promise.all(
      body.fileInfos.map(async (fileInfo) => {
        const file = FileFactory.from({
          userId: user.id,
          organizationId: user.id,
          folder: body.location,
          filename: fileInfo.name,
          size: fileInfo.sizeL,
        });
        await this.storageService.upload(file.key);
        return { name: fileInfo.name, url: (await this.storageService.getSignedPostUrl(fileInfo.name, file.size)).url };
      })
    );

    return { links: await links };
  }

  public async deleteFolder(user: User, body: DeleteFolderRequest): Promise<DeleteFolderResponse> {
    const userLocation = FileManagerService.getUserLocation(user, body.path);
    this.storageService.deleteFolder(userLocation);
    return { parentPath: path.dirname(userLocation) } as DeleteFolderResponse;
  }

  public async deleteFile(user: User, body: DeleteFileRequest): Promise<DeleteFileResponse> {
    const userLocation = FileManagerService.getUserLocation(user, body.location, true);
    this.storageService.deleteFile(userLocation);
    return { parentPath: path.dirname(userLocation) } as DeleteFileResponse;
  }

  public async getContent(user: User, location: string): Promise<{ files: Array<File>; folders: Array<Folder> }> {
    if (checkForUpwardDir(location)) throw new UpwardDirectoryError('Trying to reach a directory above root');
    const userLocation = FileManagerService.getUserLocation(user, location);
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

export class UpwardDirectoryError extends ApplicationError {}
