import { Module } from '@nestjs/common';

import { UserService, UserFormatter } from 'src/service/user';
import { UserController } from 'src/controller';
import { UserRepository } from 'src/repository';
import { StorageService } from 'src/service/storage';
import { ImageGen } from 'src/service/icon';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserFormatter, StorageService, ImageGen],
})
export class UserModule {}
