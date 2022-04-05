/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io'; // I use this lib to handle socket connections, because it is the default in nestjs and I also have prior experience with this library
import { generateKeySync } from 'crypto'; // I use this lib to generater the private keys, this is a default node lib to handle such tasks

@WebSocketGateway({ cors: true })
export class ContentGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private wss: Server;
  private logger: Logger = new Logger('ContentGateway');
  private latestContent: string;

  afterInit(server: Server) {
    this.logger.log('Initialized');
  }

  @SubscribeMessage('contentToServer')
  handleMessage(client: Socket, payload: string): void {
    this.wss.emit('contentToClient', payload);
    this.latestContent = payload;
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client connected: ${client.id}`);
    client.emit(
      'tokenToClient',
      generateKeySync('aes', { length: 256 }).export().toString('hex'),
    );
    if (this.latestContent) {
      client.emit('latestContentToClient', this.latestContent);
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
