import path from 'path';

import { NEW_ID, ZERO } from 'src/shared/util/util';

export class File {
  public name: string;
  public basename: string;
  public ext: string;
  public dir: string;

  constructor(
    public readonly key: string,
    public readonly userId: number,
    // file size in bytes
    public size: number = ZERO,
    public readonly id: number = NEW_ID,
    public readonly createdAt: Date = new Date()
  ) {
    const parsed = path.parse(key);
    this.name = parsed.name;
    this.basename = parsed.base;
    this.ext = parsed.ext;
    this.dir = parsed.dir;
  }
}
