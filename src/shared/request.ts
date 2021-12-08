import { User } from "src/model";

export interface Request extends Express.Request {
  user: User;
}