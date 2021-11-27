import { Module } from '@nestjs/common';

import { UserService } from '../service/user.service';
import { UsersController } from '../controller/users.controller';
import { UserRepository } from 'src/repository/user.repository';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UserService, UserRepository],
})
export class UserModule {}
