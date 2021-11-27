import { Module } from '@nestjs/common';

import { UsersService } from './../service/users.service';
import { UsersController } from './../controller/users.controller';
import { UserRepository } from 'src/repository/user.repository';
import { AccountService } from 'src/service/account.service';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersService, AccountService, UserRepository],
})
export class UsersModule {}
