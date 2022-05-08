import { Injectable } from '@nestjs/common';
import { Folder } from '../../model/folder';
import { File } from '../../model/file';
import { FileResponse, FolderResponse, ListResponse } from '../../interface/apiResponse';

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
    }
  }

  public toListResponse(folders: Array<Folder>, files: Array<File>): ListResponse {
    return {
      files: files.map(file => this.toFileResponse(file)),
      folders: folders.map(folder => this.toFolderResponse(folder)),
    }
  }
}
