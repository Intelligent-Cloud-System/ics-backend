import { WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { UserService } from 'src/service/user';
import { WebsocketService } from 'src/service/websocket';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/socket',
})
export class WebsocketController implements OnGatewayInit, OnGatewayConnection {
  constructor(private readonly userService: UserService, private readonly websocketService: WebsocketService) {}

  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    this.websocketService.server = server;
  }

  public async handleConnection(socket: Socket) {
    const accessToken = socket.handshake.auth.accessToken;
    const user = await this.userService.getUserByToken(accessToken);

    const rooms = this.websocketService.generateRoomNames(user);
    socket.join(rooms);
  }
}
