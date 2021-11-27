import { provide } from 'inversify-binding-decorators';
import { inject } from 'inversify';
import { GetUserCommand, GetUserCommandInput, GetUserCommandOutput, CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

import { User } from 'src/model/user';
import { UserRepository } from 'src/repository/user.repository';

@provide(AccountService)
export class AccountService {

  @inject(UserRepository) private readonly userRepository: UserRepository;

  public async getUserByToken(token: string): Promise<User> {
    const client = new CognitoIdentityProviderClient({
      region: 'eu-central-1',
    });

    const input: GetUserCommandInput = {
      AccessToken: token
    };
    const command = new GetUserCommand(input);
    
    const account: GetUserCommandOutput = await client.send(command);

    const user = await this.userRepository.getByEmail(account.Username);
    return user;
  }
}
