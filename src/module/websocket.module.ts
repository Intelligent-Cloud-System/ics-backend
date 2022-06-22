import { Global, Module } from '@nestjs/common';

import { WebsocketController } from 'src/controller';
import { WebsocketService } from 'src/service/websocket';
import { UserService } from 'src/service/user';
import { UserRepository } from 'src/repository';
import { ImageGen } from 'src/service/icon';
import { StorageService } from 'src/service/storage';

@Global()
@Module({
  imports: [],
  providers: [WebsocketController, WebsocketService, UserService, UserRepository, ImageGen, StorageService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
