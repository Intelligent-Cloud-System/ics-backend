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
    const keyElements = ['organization', organizationId, 'user', userId, location];
    if (name) keyElements.push(name);
    const key = path.posix.join(...keyElements, '/');

    return new Folder(key);
  }
}
