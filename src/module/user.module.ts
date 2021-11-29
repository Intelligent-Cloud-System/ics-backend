import { Module } from '@nestjs/common';

import { UserService } from '../service/user.service';
import { UserController } from '../controller/user.controller';
import { UserRepository } from 'src/repository/user.repository';
import { UserFormatter } from 'src/formatter/user.formatter';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserFormatter],
})
export class UserModule {}
