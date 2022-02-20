import { File } from '../../model/';
import path from 'path';

export interface FileProperties {
  organizationId: number;
  userId: number;
  folder: string;
  filename: string;
  size?: number
}

export class FileFactory {
  public static from(fileProperties: FileProperties): File {
    const { folder, filename, size } = fileProperties;
    const organizationId = fileProperties.organizationId.toString();
    const userId = fileProperties.userId.toString();

    const key = path.resolve('organization', organizationId, 'user', userId, folder, filename);
    return new File(key, fileProperties.userId, size);
  }
}