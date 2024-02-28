import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { WsGuard } from '../auth/ws/ws.guard';
import { UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { wsMiddleware } from 'src/auth/ws.mw';
import { MessagetEntity, ChatRoomEntity } from './entities';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { MessagetDto } from './dto';

@WebSocketGateway()
@UseGuards(WsGuard)
export class ChatGateway {
  constructor(
    private jwtService: JwtService,
    private chatService: ChatService,
  ) {}
  @WebSocketServer()
  server: Server;

  afterInit(client: Socket) {
    // console.log('client connected', client);
    client.use(wsMiddleware() as any);
  }

  @SubscribeMessage('NewMessage')
  async handleMessage(client: Socket, payload: MessagetEntity): Promise<any> {
    const token: string = client.handshake.headers.authorization.split(' ')[1];
    const decoded = await this.jwtService.decode(token);
    const writerId = decoded['userId'];
    if (
      !(await this.chatService.allowedToSendMessage(
        writerId,
        payload.channelId,
      ))
    )
      return;
    await this.chatService.sendMessage(
      writerId,
      payload.channelId,
      payload as MessagetDto,
    );
    await this.server.to(payload.channelId).emit('NewMessage', payload);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: Socket, payload: ChatRoomEntity): Promise<any> {
    const token: string = client.handshake.headers.authorization.split(' ')[1];
    const decoded = await this.jwtService.decode(token);
    const userId = decoded['userId'];
    await this.server.in(payload.socketId).socketsJoin(payload.channelId);
    this.chatService.addRoom(userId, payload.socketId, payload.channelId);
  }
}
