import { Global, Module } from '@nestjs/common';

import { WebsocketController } from '../controller/websocket.controller';
import { WebsocketService } from '../service/websocket/websocket.service';
import { UserService } from '../service/user/user.service';
import { UserRepository } from '../repository/user.repository';

@Global()
@Module({
  imports: [],
  providers: [WebsocketController, WebsocketService, UserService, UserRepository],
  exports: [WebsocketService],
})
export class WebsocketModule {}
