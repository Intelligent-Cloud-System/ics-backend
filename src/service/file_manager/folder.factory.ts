import * as path from 'path';
import { Folder } from '../../model/folder';

export interface FolderProperties {
  organizationId: number;
  userId: number;
  location: string;
  name?: string;
}

export class FolderFactory {
  public static from(folderProperties: FolderProperties): Folder {
    const { location, name } = folderProperties;
    const organizationId = folderProperties.organizationId.toString();
    const userId = folderProperties.userId.toString();
    const locationElements = ['organization', organizationId, 'user', userId, location];
    if (name) locationElements.push(name);
    const key = path.posix.join(...locationElements, '/');

    return new Folder(key);
  }
}
