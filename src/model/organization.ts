import { NEW_ID } from 'src/shared/util/util';

export class Organization {
  constructor(public readonly name: string, public readonly id: number = NEW_ID) {}
}
