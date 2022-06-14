import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

import { User } from '../../model';
import { WebsocketEvent } from './events';

@Injectable()
export class WebsocketService {
  public server: Server;

  public generateRoomNames(user: User): Array<string> {
    const rooms: Array<string> = [];

    rooms.push(this.userRoom(user.id));

    return rooms;
  }

  public emitUserMessage(messageName: WebsocketEvent, userId: number, message?: any): void {
    const room = this.userRoom(userId);

    this.server.to(room).emit(messageName, message);
  }

  public userRoom(userId: number): string {
    return `User|${userId}`;
  }
}
