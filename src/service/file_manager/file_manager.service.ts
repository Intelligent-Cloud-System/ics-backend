import { Injectable } from '@nestjs/common';
import { normalize, basename, dirname } from 'path';

import { StorageService } from '../storage/storage.service';
import { Folder } from '../../model/folder';
import { FolderFactory } from './folder.factory';
import { File, User } from '../../model';
import { FileFactory } from './file.factory';
import { FileManagerDeleteRequest, DeleteFolderRequest, UploadFileRequest } from 'src/interface/apiRequest';
import { ApplicationError } from 'src/shared/error/applicationError';
import { PresignedPost } from '@aws-sdk/s3-presigned-post';

export interface FileSignedPostUrl {
  file: File;
  signedPost: PresignedPost;
}

export interface FileManagerList {
  files: Array<File>;
  folders: Array<Folder>
}

@Injectable()
export class FileManagerService {
  constructor(private readonly storageService: StorageService) {}

  public ensureLocationCanBeUsed(filePath: string): boolean {
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

  public async getSignedPostUrls(user: User, body: UploadFileRequest): Promise<Array<FileSignedPostUrl>> {
    const promises = body.fileInfos.map(async (fileInfo) => {
      const file = FileFactory.from({
        userId: user.id,
        organizationId: user.id,
        folder: body.location,
        filename: fileInfo.name,
        size: fileInfo.size,
      });
      const signedPostUrl = await this.storageService.getSignedPostUrl(
        file.key,
        file.size
      );

      return {
        file,
        signedPost: signedPostUrl,
      };
    });

    const signedPostUrls = await Promise.all(promises);

    return signedPostUrls;
  }

  public async deleteFolders(folders: Array<Folder>): Promise<void> {
    const ensureFolderExistsPromises = folders.map(folder => this.ensureFolderExists(folder.key));
    await Promise.all(ensureFolderExistsPromises);

    const deleteFolderPromises = folders.map(folder => this.storageService.deleteFolder(folder.key));
    await Promise.all(deleteFolderPromises);
  }

  public async deleteFiles(files: Array<File>): Promise<void> {
    const deleteFilePromises = files.map(file => this.storageService.deleteFile(file.key));
    await Promise.all(deleteFilePromises);
  }

  public async delete(user: User, { paths }: FileManagerDeleteRequest): Promise<FileManagerList> {
    const folderPaths = paths.filter(key => Folder.isFolderKey(key));
    const filePaths = paths.filter(key => File.isFileKey(key));

    const files = filePaths.map(path => {
      const file = FileFactory.from({
        organizationId: user.id,
        userId: user.id,
        path,
      });

      return file;
    });

    const folders = folderPaths.map(path => {
      const folder = FolderFactory.from({
        organizationId: user.id,
        userId: user.id,
        location: path,
      });

      return folder;
    });

    await this.deleteFiles(files);

    await this.deleteFolders(folders);

    return { files, folders };
  }

  public async getContent(user: User, location: string): Promise<FileManagerList> {
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
