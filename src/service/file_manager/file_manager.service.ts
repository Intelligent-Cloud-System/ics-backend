import { Injectable } from '@nestjs/common';
import { normalize } from 'path';

import { StorageService } from '../storage/storage.service';
import { Folder } from '../../model/folder';
import { FolderFactory } from './folder.factory';
import { File, User } from '../../model';
import { FileFactory } from './file.factory';
import { DeleteFileRequest, DeleteFolderRequest, UploadFileRequest } from 'src/interface/apiRequest';
import { ApplicationError } from 'src/shared/error/applicationError';

@Injectable()
export class FileManagerService {
  constructor(private readonly storageService: StorageService) {}

  public static ensureLocationCanBeUsed(filePath: string): boolean {
    if (normalize(filePath).startsWith('..')) throw new UpwardDirectoryError('Trying to reach a directory above root');
    return true;
  }

  public async ensureFolderExists(key: string): Promise<boolean> {
    if (!(await this.storageService.checkFolderExists(key))) throw new FolderDoesNotExist('Folder does not exist');
    return true;
  }

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

  public async uploadFiles(user: User, body: UploadFileRequest): Promise<Array<{ name: string; url: string }>> {
    const links = Promise.all(
      body.fileInfos.map(async (fileInfo) => {
        const file = FileFactory.from({
          userId: user.id,
          organizationId: user.id,
          folder: body.location,
          filename: fileInfo.name,
          size: fileInfo.size,
        });
        const signedPostUrl = await this.storageService.getSignedPostUrl(file.key, file.size);
        return { name: fileInfo.name, url: signedPostUrl.url };
      })
    );

    return links;
  }

  public async deleteFolder(user: User, body: DeleteFolderRequest): Promise<Folder> {
    const folder = FolderFactory.from({ organizationId: user.id, userId: user.id, location: body.path });
    await this.ensureFolderExists(folder.key);
    this.storageService.deleteFolder(folder.key);
    return folder.getParent();
  }

  public async deleteFile(user: User, body: DeleteFileRequest): Promise<Folder> {
    const file = FileFactory.from({ organizationId: user.id, userId: user.id, folder: body.location });
    this.storageService.deleteFile(file.key);
    return file.folder;
  }

  public async getContent(user: User, location: string): Promise<{ files: Array<File>; folders: Array<Folder> }> {
    const folder = FolderFactory.from({ organizationId: user.id, userId: user.id, location: location });
    const objects = await this.storageService.getFolderObjects(folder.key, '/');

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
export class FolderDoesNotExist extends ApplicationError {}
