import { Injectable } from '@nestjs/common';
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
import { Result } from 'src/shared/util/util';
import { ConfigService } from '@nestjs/config';
import { AWSConfig } from 'src/config/interfaces';
import { ApplicationError } from 'src/shared/error/applicationError';

@Injectable()
export class UserService {
  private readonly client: CognitoIdentityProviderClient;
  private readonly awsConfig: AWSConfig;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService
  ) {
    const awsConfig: AWSConfig = this.configService.get<AWSConfig>(
      'aws'
    ) as AWSConfig;
    this.awsConfig = awsConfig;

    this.client = new CognitoIdentityProviderClient({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  public ensureUserExists(user?: User): void {
    if (!user) {
      throw new UserDoesNotExistsError();
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
      throw new ApplicationError('Not valid token');
    }
  }

  public async getUserByEmail(email: string): Promise<Result<User>> {
    return await this.userRepository.getByEmail(email);
  }

  private async checkCognitoUserExist(username: string): Promise<boolean> {
    const input: AdminGetUserCommandInput = {
      UserPoolId: this.awsConfig.userPoolId,
      Username: username,
    };

    const command = new AdminGetUserCommand(input);
    try {
      const response = await this.client.send(command);
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
      throw new ApplicationError('Cognito user does not exist');
    }

    const user = new User(body.email, body.firstName, body.lastName);

    const insertedUser = await this.upsertUser(user);

    return insertedUser;
  }
}

export class UserDoesNotExistsError extends ApplicationError {}
