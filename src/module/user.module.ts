import { Module } from '@nestjs/common';

import { UserService, UserFormatter } from 'src/service/user';
import { UserController } from 'src/controller';
import { UserRepository } from 'src/repository';
import { ImageGen } from 'src/service/icon';
import { StorageService } from 'src/service/storage';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserFormatter, ImageGen, StorageService],
})
export class UserModule {}
