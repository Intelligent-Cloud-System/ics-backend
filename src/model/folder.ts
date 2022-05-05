import { ApplicationError } from '../shared/error/applicationError';

export class Folder {
  public organizationId: number;
  public userId: number;
  public path: string;

  /*
  key has the following structure:
  organization/{organizationId}/user/{userId}/{path}
  */
  constructor(public readonly key: string) {
    const splitKey = key.split('/');

    const userId = parseInt(splitKey[1]);
    const organizationId = parseInt(splitKey[3]);
    const path = splitKey.slice(4).join('/');

    if (Number.isNaN(userId) || Number.isNaN(organizationId) || !key.endsWith('/')) {
      throw new InvalidFolderKeyError();
    }

    this.organizationId = organizationId;
    this.userId = userId;
    this.path = path;
  }
}

export class InvalidFolderKeyError extends ApplicationError {}
