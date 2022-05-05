import { Injectable } from '@nestjs/common';
import { Folder } from '../../model/folder';
import { FolderResponse } from '../../interface/apiResponse';

@Injectable()
export class FileManagerFormatter {
  public async toFolderResponse(folder: Folder): Promise<FolderResponse> {
    return {
      path: folder.path,
    };
  }
}
