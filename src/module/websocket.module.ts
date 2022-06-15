import { Global, Module } from '@nestjs/common';

import { WebsocketController } from 'src/controller';
import { WebsocketService } from 'src/service/websocket';
import { UserService } from 'src/service/user';
import { UserRepository } from 'src/repository';

@Global()
@Module({
  imports: [],
  providers: [WebsocketController, WebsocketService, UserService, UserRepository],
  exports: [WebsocketService],
})
export class WebsocketModule {}
