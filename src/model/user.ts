import { NEW_ID } from 'src/util/util';

export class User {
  constructor(
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly id: number = NEW_ID
  ) {}
}
