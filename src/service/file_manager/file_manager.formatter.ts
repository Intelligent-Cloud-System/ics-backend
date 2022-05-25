import { Injectable } from '@nestjs/common';
import { Folder } from '../../model/folder';
import { File } from '../../model/file';
import {
  FileResponse,
  FolderResponse,
  FileManagerListResponse,
  SignedPostUrlsResponse
} from '../../interface/apiResponse';
import { FileSignedPostUrl } from './file_manager.service';

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

  public toLinksResponse (signedPostUrls: Array<FileSignedPostUrl>): SignedPostUrlsResponse {
    const urls = signedPostUrls.map(({ file, signedPost }) => ({
      path: file.path,
      key: file.key,
      url: signedPost.url,
      fields: signedPost.fields,
    }));

    return { urls }
  }
}
