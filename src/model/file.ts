import { NEW_ID } from '../util/util';

export class File {
  constructor(
    public readonly filePath: string,
    public readonly fileSize: number,
    public readonly userId: number,
    public readonly id: number = NEW_ID
  ) {}
}
