import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { GetCurrentUserId } from '../common/decorators';
import { ChatService } from './chat.service';
import { ChannelDto, MessagetDto, DmDTO, MuteDto, JoinChannelDto } from './dto';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ChannelEntity, DmEntity } from './entities';
import { UserEntity } from 'src/user/entities/user.entity';
import { MessagetEntity } from './entities/message.entity';
import { multerOptions } from 'src/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserChatDto } from './dto/user.chat.dto';
import { User } from '@prisma/client';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('create-channel')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse()
  async createChannel(
    @GetCurrentUserId() userId: string,
    @Body() channeltDto: ChannelDto,
  ) {
    return new ChannelEntity(
      await this.chatService.createChannel(userId, channeltDto),
    );
  }

  @Post('create-dm')
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ type: DmEntity })
  async createDm(@GetCurrentUserId() userId: string, @Body() dmDto: DmDTO) {
    return await this.chatService.createDm(userId, dmDto);
  }

  @Delete('delete-channel/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async deleteChannel(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return await this.chatService.deleteChannel(userId, id);
  }

  @Post('actions/owner/:id/transfer')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelEntity })
  async transferOwner(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() body: UserChatDto,
  ) {
    return new UserEntity(
      await this.chatService.transferOwner(userId, id, body),
    );
  }

  @Post('actions/admins/:id/add')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async addAdmin(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() body: UserChatDto,
  ) {
    return new ChannelEntity(await this.chatService.addAdmin(userId, id, body));
  }

  @Post('actions/admins/:id/remove')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async removeAdmin(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() body: UserChatDto,
  ) {
    return new ChannelEntity(
      await this.chatService.removeAdmin(userId, id, body),
    );
  }

  @Post('actions/users/:id/add')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelEntity })
  async addUser(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() body: UserChatDto,
  ) {
    return new ChannelEntity(await this.chatService.addUser(userId, id, body));
  }

  @Post('actions/users/:id/remove')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelEntity })
  async removeUser(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() body: UserChatDto,
  ) {
    return new ChannelEntity(
      await this.chatService.removeUser(userId, id, body),
    );
  }

  @Post('actions/join/')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelEntity })
  async joinChannel(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() body: JoinChannelDto,
  ) {
    return new ChannelEntity(await this.chatService.joinChannel(userId, body));
  }

  @Post('actions/leave/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelEntity })
  async leaveChannel(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return new ChannelEntity(await this.chatService.leaveChannel(userId, id));
  }

  @Post('actions/block/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelEntity })
  async blockUser(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() body: UserChatDto,
  ) {
    return new ChannelEntity(
      await this.chatService.blockUser(userId, id, body),
    );
  }

  @Post('actions/unblock/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelEntity })
  async unblockUser(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() body: UserChatDto,
  ) {
    return new ChannelEntity(
      await this.chatService.unblockUser(userId, id, body),
    );
  }

  @Post('actions/mute/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelEntity })
  async muteUser(@GetCurrentUserId() userId: string, @Body() body: MuteDto) {
    return new ChannelEntity(await this.chatService.muteUser(userId, body));
  }

  @Post('actions/unmute/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelEntity })
  async unmuteUser(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() body: UserChatDto,
  ) {
    return new ChannelEntity(
      await this.chatService.unmuteUser(userId, id, body),
    );
  }

  @Get('channels')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [ChannelEntity] })
  async getChannels(@GetCurrentUserId() userId: string) {
    const channels = await this.chatService.getChannels(userId);
    return channels.map((channel) => new ChannelEntity(channel));
  }

  @Get('channels/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: ChannelEntity })
  async getChannel(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return new ChannelEntity(await this.chatService.getChannel(userId, id));
  }

  @Post('uploadPicture/:id')
  @ApiCreatedResponse()
  @UseInterceptors(FileInterceptor('picture', multerOptions))
  async uploadAvatar(
    @UploadedFile()
    file: Express.Multer.File,
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return new ChannelEntity(
      await this.chatService.uploadPicture(userId, id, file),
    );
  }

  @Get('channels/:id/picture')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async getChannelPicture(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Res() res,
  ) {
    return await this.chatService.getChannelPicture(res, userId, id);
  }

  @Get('channels/:id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [MessagetEntity] })
  async getChannelMessages(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return await this.chatService.getMessages(userId, id);
  }

  @Get('direct-messages')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [DmEntity] })
  async getDms(@GetCurrentUserId() userId: string) {
    return await this.chatService.getDms(userId);
  }

  @Get('direct-messages/uninitiated')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [DmEntity] })
  async getUninitiatedDms(@GetCurrentUserId() userId: string) {
    return await this.chatService.getUninitiatedDms(userId);
  }

  @Get('direct-messages/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: DmEntity })
  async getDm(@GetCurrentUserId() userId: string, @Param('id') id: string) {
    return await this.chatService.getDm(userId, id);
  }

  @Get('direct-messages/:id/messages')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [MessagetEntity] })
  async getDmMessages(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
  ) {
    return await this.chatService.getMessages(userId, id);
  }

  @Post('sendMessage/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: MessagetEntity })
  async sendMessage(
    @GetCurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() messagetDto: MessagetDto,
  ) {
    return await this.chatService.sendMessage(userId, id, messagetDto);
  }
}
