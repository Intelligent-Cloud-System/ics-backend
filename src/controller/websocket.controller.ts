import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UserService } from '../service/user.service';
import { WebsocketService } from '../service/websocket/websocket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  path: '/socket',
})
export class WebsocketController implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    private readonly userService: UserService,
    private readonly websocketService: WebsocketService,
  ) {
  }

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.websocketService.server = server;
  }

  handleDisconnect(socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  public async handleConnection(socket: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${socket.id}`);

    const accessToken = socket.handshake.auth.accessToken;
    const user = await this.userService.getUserByToken(accessToken);

    const rooms = this.websocketService.generateRoomNames(user);
    socket.join(rooms);
  }
}