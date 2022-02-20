import { Injectable } from '@nestjs/common';

import { FileResponse, FileDeleteResponse, FileLinkResponse } from 'src/interface/apiResponse';
import { getFileName } from 'src/shared/util/file.utils';
import { File } from 'src/model';

@Injectable()
export class FileFormatter {
  public toFileResponse(file: File): FileResponse {
    return {
      id: file.id,
      name: getFileName(file.filePath),
      size: file.fileSize,
    };
  }

  public toFileLinkResponse(fileLink: string, iv: string): FileLinkResponse {
    return {
      link: `/files/download/${fileLink}?iv=${iv}`,
    };
  }

  public toFilesResponse(files: File[]): FileResponse[] {
    return files.map(this.toFileResponse);
  }

  public toFileDeleteResponse(file: File): FileDeleteResponse {
    return {
      id: file.id,
    };
  }
}
