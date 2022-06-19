import { Injectable } from '@nestjs/common';

import { Folder, File } from 'src/model';
import {
  FileResponse,
  FolderResponse,
  FileManagerListResponse,
  SignedPostUrlsResponse,
  SignedGetUrlsResponse,
} from 'src/interface/apiResponse';
import { FileSignedGetUrl, FileSignedPostUrl } from 'src/service/file_manager';

@Injectable()
export class FileManagerFormatter {
  public toFolderResponse(folder: Folder): FolderResponse {
    return {
      path: folder.getPath(),
    };
  }

  public toFileResponse(file: File): FileResponse {
    return {
      size: file.size,
      lastModifiedAt: file.lastModifiedAt,
      basename: file.basename,
      path: file.path,
    };
  }

  public toListResponse(folders: Array<Folder>, files: Array<File>): FileManagerListResponse {
    return {
      files: files.map((file) => this.toFileResponse(file)),
      folders: folders.map((folder) => this.toFolderResponse(folder)),
    };
  }

  public toPostUrlsResponse(signedPostUrls: Array<FileSignedPostUrl>): SignedPostUrlsResponse {
    const urls = signedPostUrls.map(({ file, signedPost }) => ({
      path: file.path,
      key: file.key,
      url: signedPost.url,
      fields: signedPost.fields,
    }));

    return { urls };
  }

  public toGetUrlsResponse(signedPostUrls: Array<FileSignedGetUrl>): SignedGetUrlsResponse {
    const urls = signedPostUrls.map(({ file, url }) => ({
      path: file.path,
      key: file.key,
      url,
    }));

    return { urls };
  }
}
