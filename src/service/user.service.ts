import { inject } from 'inversify';
import { provide } from 'inversify-binding-decorators';
import {
  GetUserCommand,
  GetUserCommandInput,
  GetUserCommandOutput,
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  AdminGetUserCommandInput,
} from '@aws-sdk/client-cognito-identity-provider';

import { UserRepository } from 'src/repository/user.repository';
import { User } from 'src/model/user';
import { RegisterUserRequest } from 'src/interface/apiRequest';
import { Result } from 'src/util/util';

@provide(UserService)
export class UserService {

  private readonly client: CognitoIdentityProviderClient;

  constructor(
    @inject(UserRepository) private readonly userRepository: UserRepository,
  ) {
    this.client = new CognitoIdentityProviderClient({
      region: 'eu-central-1',
      credentials: {
        accessKeyId: 'AKIAUIPOTL7COBENWWX6',
        secretAccessKey: '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',
      },
    });
  }

  public ensureUserExists(user?: User): void {
    if (!user) {
      throw new Error('User does not exist');
    }
  }

  public async getUserByToken(token: string): Promise<Result<User>> {
    const input: GetUserCommandInput = {
      AccessToken: token,
    };
    const command = new GetUserCommand(input);

    const account: GetUserCommandOutput = await this.client.send(command);

    if (account.Username) {
      const user = await this.userRepository.getByEmail(account.Username);
      if (user) {
        return user;
      }
    } else {
      throw new Error('Not valid token');
    }
  }

  public async getUserByEmail(email: string): Promise<Result<User>>{
    return await this.userRepository.getByEmail(email);
  }

  private async checkCognitoUserExist(username: string): Promise<boolean> {
    console.log({ username });
    const input: AdminGetUserCommandInput = {
      UserPoolId: 'eu-central-1_dY4ZfiZEY',
      Username: username,
    };

    const command = new AdminGetUserCommand(input);
    try {
      const response = await this.client.send(command);
      console.log(response);
      if (response) {
        return true;
      }
    } catch (e: any) {}

    return false;
  }

  public async upsertUser(user: User): Promise<User> {
    const existingUser = await this.getUserByEmail(user.email);
    if (existingUser) {
      return existingUser;
    }

    return await this.userRepository.insertUser(user);
  }

  public async registerUser(body: RegisterUserRequest): Promise<User> {
    const userExist = await this.checkCognitoUserExist(body.email);
    if (!userExist) {
      throw new Error('Cognito user does not exist');
    }

    const user = new User(body.email, body.firstName, body.lastName);

    const insertedUser = await this.upsertUser(user);
    console.log({ insertedUser });
    return insertedUser;
  }
}
