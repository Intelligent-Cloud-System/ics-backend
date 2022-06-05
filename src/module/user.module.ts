import { Module } from '@nestjs/common';

import { UserService } from 'src/service/user/user.service';
import { UserController } from 'src/controller/user.controller';
import { UserRepository } from 'src/repository/user.repository';
import { UserFormatter } from 'src/service/user/user.formatter';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserFormatter],
})
export class UserModule {}
