import * as path from 'path';
import { File } from '../../model/';

export interface FileProperties {
  organizationId: number;
  userId: number;
  folder: string;
  filename: string;
  size?: number;
}

export interface FilePropertiesWithPath {
  organizationId: number;
  userId: number;
  path: string;
  size?: number;
}

export class FileFactory {
  public static from(fileProperties: FileProperties | FilePropertiesWithPath): File {
    if ('path' in fileProperties) {
      const { size } = fileProperties;
      const organizationId = fileProperties.organizationId.toString();
      const userId = fileProperties.userId.toString();
      const key = path.posix.join('organization', organizationId, 'user', userId, fileProperties.path);
      return new File(key, size);
    } else {
      const { folder, filename, size } = fileProperties;
      const organizationId = fileProperties.organizationId.toString();
      const userId = fileProperties.userId.toString();
      const key = path.posix.join('organization', organizationId, 'user', userId, folder, filename);
      return new File(key, size);
    }
  }
}
