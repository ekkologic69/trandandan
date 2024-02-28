import { HttpException, HttpStatus, Injectable, Res } from '@nestjs/common';
import { ChannelDto, MessagetDto, DmDTO, MuteDto } from './dto';
import { PrismaService } from 'nestjs-prisma';
import * as argon from 'argon2';
import { DmEntity } from './entities';
import { JoinChannelDto, UserChatDto } from './dto';
import { ActiveUser } from './active.user.type';
import { use } from 'passport';

export enum Actions {
  transfer = 'transfer',
  delete = 'delete',
  addAdmin = 'addAdmin',
  removeAdmin = 'removeAdmin',
  block = 'block',
  unblock = 'unblock',
  mute = 'mute',
  unmute = 'unmute',
  addUser = 'addUser',
  removeUser = 'removeUser',
  join = 'join',
  leave = 'leave',
  sendMessage = 'sendMessage',
}

@Injectable()
export class ChatService {
  private activeUsers: ActiveUser[] = [];
  constructor(private prismaService: PrismaService) {}

  async createChannel(userId: string, channeltDto: ChannelDto) {
    if (channeltDto.isPassword && !channeltDto.password) {
      throw new HttpException('Password is required', HttpStatus.BAD_REQUEST);
    }
    let hashedPassword: string;
    if (channeltDto.isPassword) {
      hashedPassword = await argon.hash(channeltDto.password);
    } else {
      hashedPassword = null;
    }
    const channel = await this.prismaService.channel.create({
      data: {
        name: channeltDto.name,
        private: channeltDto.private,
        isPassword: channeltDto.isPassword,
        password: hashedPassword,
        picture: '',
        owner: {
          connect: {
            id: userId,
          },
        },
        members: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        ownerId: true,
        admins: true,
        members: true,
        blocked: true,
        muted: true,
      },
    });

    return channel;
  }

  async createDm(userId: string, dmDto: DmDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: dmDto.userId,
      },
      select: {
        avatarUrl: true,
      },
    });
    if (user === null) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const dm = await this.prismaService.channel.findFirst({
      where: {
        members: {
          every: {
            id: {
              in: [userId, dmDto.userId],
            },
          },
        },
        dm: true,
      },
    });
    if (dm) {
      throw new HttpException(
        'Direct message channel already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const dirm = await this.prismaService.channel.create({
      data: {
        name: '',
        private: true,
        isPassword: false,
        picture: '',
        owner: {
          connect: {
            id: userId,
          },
        },
        members: {
          connect: [
            {
              id: userId,
            },
            {
              id: dmDto.userId,
            },
          ],
        },
      },
    });

    return new DmEntity({
      id: dirm.id,
      userAId: userId,
      userBId: dmDto.userId,
      avatar: user.avatarUrl,
    });
  }

  async deleteChannel(userId: string, id: string) {
    if (await !this.CanDoAction(userId, id, Actions.delete)) {
      throw new HttpException(
        'You do not have permission to delete this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }

    await this.prismaService.channel.delete({
      where: {
        id,
      },
    });
  }

  async transferOwner(userId: string, id: string, userDto: UserChatDto) {
    if (await !this.CanDoAction(userId, id, Actions.transfer))
      throw new HttpException(
        'You do not have permission to transfer ownership of this channel',
        HttpStatus.UNAUTHORIZED,
      );
    const newOwnerId: string = userDto.id;
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        blocked: true,
        ownerId: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.ownerId !== userId) {
      throw new HttpException(
        'You are not the owner of this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: newOwnerId,
      },
    });
    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.blocked.find((u) => u.id === user.id)) {
      throw new HttpException(
        'This user is blocked in this channel',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.prismaService.channel.update({
      where: {
        id,
      },
      data: {
        owner: {
          connect: {
            id: newOwnerId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async addAdmin(userId: string, id: string, userDto: UserChatDto) {
    if (await !this.CanDoAction(userId, id, Actions.addAdmin)) {
      throw new HttpException(
        'You do not have permission to add an admin to this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const newAdminId: string = userDto.id;
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        blocked: true,
        ownerId: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.ownerId !== userId) {
      throw new HttpException(
        'You are not the owner of this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: newAdminId,
      },
    });

    if (channel.blocked.find((u) => u.id === user.id)) {
      throw new HttpException(
        'This user is blocked in this channel',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.prismaService.channel.update({
      where: {
        id,
      },
      data: {
        admins: {
          connect: {
            id: newAdminId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        blocked: true,
        muted: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async removeAdmin(userId: string, id: string, userDto: UserChatDto) {
    if (!this.CanDoAction(userId, id, Actions.removeAdmin)) {
      throw new HttpException(
        'You do not have permission to remove an admin from this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const removeUserId: string = userDto.id;
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        admins: true,
        ownerId: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.ownerId !== userId) {
      throw new HttpException(
        'You are not the owner of this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }

    if (!channel.admins.find((u) => u.id === removeUserId)) {
      throw new HttpException(
        'This user is not an admin in this channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prismaService.channel.update({
      where: {
        id,
      },
      data: {
        admins: {
          disconnect: {
            id: removeUserId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        blocked: true,
        muted: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async addUser(userId: string, id: string, userDto: UserChatDto) {
    if (await !this.CanDoAction(userId, id, Actions.addUser)) {
      throw new HttpException(
        'You do not have permission to add a user to this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const newUserId: string = userDto.id;
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        dm: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.dm) {
      throw new HttpException(
        'This is a direct message channel',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: newUserId,
      },
    });

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prismaService.channel.update({
      where: {
        id,
      },
      data: {
        members: {
          connect: {
            id: newUserId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        blocked: true,
        muted: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async removeUser(userId: string, id: string, userDto: UserChatDto) {
    if (await !this.CanDoAction(userId, id, Actions.removeUser)) {
      throw new HttpException(
        'You do not have permission to remove a user from this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const removeUserId: string = userDto.id;
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        dm: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.dm) {
      throw new HttpException(
        'This is a direct message channel',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        id: removeUserId,
      },
    });

    if (!user) {
      throw new HttpException(
        'User with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prismaService.channel.update({
      where: {
        id,
      },
      data: {
        members: {
          disconnect: {
            id: removeUserId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        blocked: true,
        muted: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async joinChannel(userId: string, joinChannel: JoinChannelDto) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: joinChannel.id,
      },
      select: {
        members: true,
        isPassword: true,
        password: true,
        dm: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.dm) {
      throw new HttpException(
        'This is a direct message channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.members.find((u) => u.id === userId)) {
      throw new HttpException(
        'You are already a member of this channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.isPassword) {
      const isPasswordValid = await argon.verify(
        channel.password,
        joinChannel.password,
      );
      if (!isPasswordValid) {
        throw new HttpException(
          'Invalid password for this channel',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return await this.prismaService.channel.update({
      where: {
        id: joinChannel.id,
      },
      data: {
        members: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async leaveChannel(userId: string, id: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        members: true,
        ownerId: true,
        dm: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.dm) {
      throw new HttpException(
        'This is a direct message channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.ownerId === userId) {
      throw new HttpException(
        'You cannot leave a channel you own',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!channel.members.find((u) => u.id === userId)) {
      throw new HttpException(
        'You are not a member of this channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prismaService.channel.update({
      where: {
        id,
      },
      data: {
        members: {
          disconnect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async blockUser(userId: string, id: string, userDto: UserChatDto) {
    if (await !this.CanDoAction(userId, id, Actions.block)) {
      throw new HttpException(
        'You do not have permission to block a user in this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const blockUserId: string = userDto.id;
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        members: true,
        dm: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.dm) {
      throw new HttpException(
        'This is a direct message channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!channel.members.find((u) => u.id === blockUserId)) {
      throw new HttpException(
        'This user is not a member of this channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prismaService.channel.update({
      where: {
        id,
      },
      data: {
        blocked: {
          connect: {
            id: blockUserId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        blocked: true,
        muted: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async unblockUser(userId: string, id: string, userDto: UserChatDto) {
    if (await !this.CanDoAction(userId, id, Actions.unblock)) {
      throw new HttpException(
        'You do not have permission to unblock a user in this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const unblockUserId: string = userDto.id;
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        blocked: true,
        ownerId: true,
        admins: true,
        dm: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.dm) {
      throw new HttpException(
        'This is a direct message channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!channel.blocked.find((u) => u.id === unblockUserId)) {
      throw new HttpException(
        'This user is not blocked in this channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prismaService.channel.update({
      where: {
        id,
      },
      data: {
        blocked: {
          disconnect: {
            id: unblockUserId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        blocked: true,
        muted: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async muteUser(userId: string, muteUserDto: MuteDto) {
    if (await !this.CanDoAction(userId, muteUserDto.channelId, Actions.mute)) {
      throw new HttpException(
        'You do not have permission to mute a user in this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: muteUserDto.channelId,
      },
      select: {
        members: true,
        ownerId: true,
        admins: true,
        dm: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.dm) {
      throw new HttpException(
        'This is a direct message channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!channel.members.find((u) => u.id === muteUserDto.userId)) {
      throw new HttpException(
        'This user is not a member of this channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prismaService.channel.update({
      where: {
        id: muteUserDto.channelId,
      },
      data: {
        muted: {
          create: {
            userId: muteUserDto.userId,
            end: muteUserDto.until,
          },
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        blocked: true,
        muted: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async unmuteUser(userId: string, id: string, userDto: UserChatDto) {
    if (await !this.CanDoAction(userId, id, Actions.unmute)) {
      throw new HttpException(
        'You do not have permission to unmute a user in this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const unmuteUserId: string = userDto.id;
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        muted: true,
        ownerId: true,
        admins: true,
        dm: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (channel.dm) {
      throw new HttpException(
        'This is a direct message channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!channel.muted.find((u) => u.userId === unmuteUserId)) {
      throw new HttpException(
        'This user is not muted in this channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    const mute = await this.prismaService.mute.findFirst({
      where: {
        userId: unmuteUserId,
        channelId: id,
      },
    });

    return await this.prismaService.channel.update({
      where: {
        id,
      },
      data: {
        muted: {
          delete: mute,
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        blocked: true,
        muted: true,
        admins: true,
        ownerId: true,
      },
    });
  }

  async getChannels(userId: string) {
    const channels = await this.prismaService.channel.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
        dm: false,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        ownerId: true,
        admins: true,
        members: true,
      },
    });

    return channels;
  }

  async getChannel(userId: string, id: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
        dm: false,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        ownerId: true,
        admins: true,
        members: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!channel.members.find((u) => u.id === userId)) {
      throw new HttpException(
        'You are not a member of this channel',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      channel.ownerId === userId ||
      channel.admins.find((u) => u.id === userId)
    ) {
      return channel;
    }
    return await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        ownerId: true,
        admins: true,
        members: true,
      },
    });
  }

  async getMessages(userId: string, id: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        members: true,
        blocked: true,
        messages: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      !channel.members.find((u) => u.id === userId) ||
      !channel.blocked.find((u) => u.id === userId)
    ) {
      throw new HttpException(
        'You do not have premision to view this channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    return channel.messages;
  }

  async getDms(userId: string) {
    const dms = await this.prismaService.channel.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
        dm: true,
      },
      select: {
        id: true,
        members: true,
        picture: true,
      },
    });

    const dmEntities = dms.map((dm) => {
      const userAId = userId;
      const userBId = dm.members.find((u) => u.id !== userId).id;
      const avatar = dm.members.find((u) => u.id !== userId).avatarUrl;
      return new DmEntity({ id: dm.id, userAId, userBId, avatar });
    });
    return dmEntities;
  }

  async getDm(userId: string, id: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
        dm: true,
      },
      include: {
        members: true,
      },
    });

    if (!channel.members.find((u) => u.id === userId)) {
      throw new HttpException(
        'You are not a member of this channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userAId = userId;
    const userBId = channel.members.find((u) => u.id !== userId).id;
    const avatar = channel.members.find((u) => u.id !== userId).avatarUrl;
    return new DmEntity({ id: channel.id, userAId, userBId, avatar });
  }

  async getUninitiatedDms(userId: string) {
    const { friends } = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: true,
      },
    });
    const dmEntities = friends.map(async (f) => {
      const userAId = userId;
      const userBId = f;
      const { avatarUrl } = await (this.prismaService.user.findUnique({
        where: { id: f },
        select: { avatarUrl: true },
      }) as any);
      return new DmEntity({ id: null, userAId, userBId, avatar: avatarUrl });
    });
    return dmEntities;
  }

  async sendMessage(userId: string, id: string, message: MessagetDto) {
    if ((await this.allowedToSendMessage(userId, id)) === false) {
      throw new HttpException(
        'You do not have permission to send messages in this channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prismaService.message.create({
      data: {
        content: message.content,
        channel: {
          connect: {
            id,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        channelId: true,
        userId: true,
      },
    });
  }

  async CanDoAction(userId: string, id: string, action: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        members: true,
        admins: true,
        ownerId: true,
        blocked: true,
        muted: true,
        dm: true,
      },
    });
    if (!channel) return false;
    if (
      channel.dm &&
      (action === Actions.sendMessage ||
        action === Actions.block ||
        action === Actions.unblock ||
        action === Actions.mute ||
        action === Actions.unmute ||
        action === Actions.delete)
    ) {
      return true;
    }
    if (channel.dm) {
      return false;
    }

    if (channel.ownerId === userId) {
      return true;
    }

    if (
      channel.admins.find((u) => u.id === userId) &&
      action !== Actions.transfer &&
      action !== Actions.delete &&
      action !== Actions.addAdmin &&
      action !== Actions.removeAdmin
    ) {
      return true;
    }

    if (
      channel.members.find((u) => u.id === userId) &&
      !channel.blocked.find((u) => u.id === userId) &&
      !channel.muted.find((u) => u.id === userId) &&
      (action === Actions.sendMessage ||
        action === Actions.join ||
        action === Actions.leave)
    ) {
      return true;
    }

    return false;
  }

  addRoom(userId: string, socketId: string, channelId: string) {
    const user = this.activeUsers.find((u) => u.userId === userId);
    if (user) {
      user.channelIds.push(channelId);
    } else {
      this.activeUsers.push({ userId, socketId, channelIds: [channelId] });
    }
  }

  allRooms(userId: string) {
    const user = this.activeUsers.find((u) => u.userId === userId);
    if (user) {
      return user.channelIds;
    }
    return [];
  }

  removeActiveUser(socketId: string) {
    const index = this.activeUsers.indexOf(
      this.activeUsers.find((u) => u.socketId === socketId),
    );
    if (index > -1) {
      this.activeUsers.splice(index, 1);
    }
  }

  async uploadPicture(userId: string, id: string, file: Express.Multer.File) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        ownerId: true,
        admins: true,
        dm: true,
      },
    });

    if (channel.dm) {
      throw new HttpException(
        'This is a direct message channel',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      channel.ownerId !== userId &&
      !channel.admins.find((u) => u.id === userId)
    ) {
      throw new HttpException(
        'You do not have permission to upload a picture for this channel',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const up = await this.prismaService.channel.update({
      where: {
        id,
      },
      data: {
        picture: file.path,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        picture: true,
        private: true,
        isPassword: true,
        members: true,
        blocked: true,
        muted: true,
        admins: true,
        ownerId: true,
      },
    });
    return up;
  }

  async getChannelPicture(@Res() res, userId: string, id: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id,
      },
      select: {
        members: true,
        blocked: true,
        picture: true,
        dm: true,
      },
    });

    if (!channel) {
      throw new HttpException(
        'Channel with this id does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (
      !channel.members.find((u) => u.id === userId) ||
      !channel.blocked.find((u) => u.id === userId)
    ) {
      throw new HttpException(
        'You do not have premision to view this channel',
        HttpStatus.BAD_REQUEST,
      );
    }
    return res.sendFile(channel.picture.split('/')[1], {
      root: './upload',
    });
  }

  async allowedToSendMessage(userId: string, channelId: string) {
    const channel = await this.prismaService.channel.findUnique({
      where: {
        id: channelId,
      },
      select: {
        members: true,
        blocked: true,
        muted: true,
        dm: true,
      },
    });

    if (!channel) {
      return false;
    }

    if (channel.dm) {
      if (!channel.members.find((u) => u.id === userId)) {
        return false;
      }

      const otherUser = await this.prismaService.user.findFirst({
        where: {
          id: channel.members.find((u) => u.id !== userId).id,
        },
        select: {
          blockedUsers: true,
        },
      });

      if (otherUser.blockedUsers.find((u) => u === userId)) {
        return false;
      }
    }
    if (
      !channel.members.find((u) => u.id === userId) ||
      !channel.blocked.find((u) => u.id === userId)
    ) {
      return false;
    }

    const mute = channel.muted.find((u) => u.userId === userId);
    if (mute) {
      if (mute.end < new Date()) {
        await this.prismaService.mute.delete({
          where: {
            id: mute.id,
          },
        });
        return true;
      }
    }
    return true;
  }
}
