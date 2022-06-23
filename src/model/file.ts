import * as path from 'path';

import { ZERO } from 'src/shared/util/util';
import { Folder } from './folder';

export class File {
  public name: string;
  public basename: string;
  public ext: string;
  public path: string;
  public folder: Folder;

  constructor(
    public readonly key: string,
    // file size in bytes
    public size: number = ZERO,
    public readonly lastModifiedAt: Date = new Date()
  ) {
    const parsed = path.parse(key);
    this.name = parsed.name;
    this.basename = parsed.base;
    this.ext = parsed.ext;
    const dir = parsed.dir;

    // TODO: think how prettify it
    this.folder = new Folder(`${dir}/`);
    this.path = path.join(this.folder.path || '', this.basename);
  }

  public static isFileKey(key: string): boolean {
    return !key.endsWith('/');
  }
}
