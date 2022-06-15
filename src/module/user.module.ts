import { Module } from '@nestjs/common';

import { UserService, UserFormatter } from 'src/service/user';
import { UserController } from 'src/controller';
import { UserRepository } from 'src/repository';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserFormatter],
})
export class UserModule {}
