import * as path from 'path';

import { Folder } from 'src/model/folder';

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
    const key = path.posix.join('organization', organizationId, 'user', userId, location, name || '', '/');

    return new Folder(key);
  }
}
