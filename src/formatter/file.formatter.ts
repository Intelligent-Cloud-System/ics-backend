import { Injectable } from '@nestjs/common';

import { FileResponse, FileDeleteResponse } from 'src/interface/apiResponse';
import { bytesToSize, getFileName } from 'src/shared/util/file.utils';
import { File } from 'src/model';

@Injectable()
export class FilesFormatter {
  public toFileResponce(file: File): FileResponse {
    return {
      id: file.id,
      name: getFileName(file.filePath),
      size: bytesToSize(file.fileSize),
    };
  }

  public toFilesResponce(files: File[]): FileResponse[] {
    return files.map(this.toFileResponce);
  }

  public toFileDeleteResponce(file: File): FileDeleteResponse {
    return {
      id: file.id,
    };
  }
}
