import { dirname } from 'path';

import { ApplicationError } from 'src/shared/error/applicationError';

enum FolderKeyInfo {
  organizationIdPosition = 1,
  userIdPosition = 3,
  pathPosition = 4,
}

export class Folder {
  public organizationId?: number;
  public userId?: number;
  public path?: string;

  /*
    key has the following structure:
    organization/{organizationId}/user/{userId}/{path}
  */
  constructor(public readonly key: string) {
    const splitKey = key.split('/');

    const organizationId = parseInt(splitKey[FolderKeyInfo.organizationIdPosition]);
    const userId = parseInt(splitKey[FolderKeyInfo.userIdPosition]);
    const path = splitKey.slice(FolderKeyInfo.pathPosition).join('/');

    if (!key.endsWith('/')) {
      throw new InvalidFolderKeyError();
    }

    this.organizationId = Number.isNaN(organizationId) ? undefined : organizationId;
    this.userId = Number.isNaN(userId) ? undefined : userId;
    this.path = !this.organizationId || !this.userId ? undefined : path;
  }

  public static isFolderKey(key: string): boolean {
    return key.endsWith('/');
  }

  public getOrganizationId(): number {
    if (!this.organizationId || Number.isNaN(this.organizationId)) {
      throw new FolderOrganizationIdIsNaNError();
    }

    return this.organizationId;
  }

  public getUserId(): number {
    if (!this.userId || Number.isNaN(this.userId)) {
      throw new FolderUserIdIsNaNError();
    }

    return this.userId;
  }

  public getPath(): string {
    if (this.path === undefined) {
      throw new NoPathError();
    }

    return this.path;
  }

  public getParent(): Folder {
    return new Folder(`${dirname(this.key)}/`);
  }
}

export class InvalidFolderKeyError extends ApplicationError {}
export class FolderOrganizationIdIsNaNError extends ApplicationError {}
export class FolderUserIdIsNaNError extends ApplicationError {}
export class NoPathError extends ApplicationError {}
