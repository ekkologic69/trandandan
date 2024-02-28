import { HttpException, Injectable, Res } from '@nestjs/common';
import { UpdateUsernameDto, UpdateEmailDto, UsersDto } from './dto';
import { PrismaService } from 'nestjs-prisma';
import { User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';
import { Response } from 'express';

enum Actions {
  sendRequest = 'sendRequest',
  acceptRequest = 'acceptRequest',
  declineRequest = 'declineRequest',
  blockUser = 'blockUser',
  unblockUser = 'unblockUser',
  removeFriend = 'removeFriend',
}

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(userId: string) {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        score: true,
        createdAt: true,
        updatedAt: true,
        wins: true,
        losses: true,
        rank: true,
        playTime: true,
      },
    });
    const blocks = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        blockedBy: true,
      },
    });
    return users.filter((u) => !blocks.blockedBy.includes(u.id));
  }

  async findUsers(userId: string, usersDto: UsersDto) {
    const users = await this.prismaService.user.findMany({
      where: {
        id: {
          in: usersDto.ids,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        score: true,
        createdAt: true,
        updatedAt: true,
        wins: true,
        losses: true,
        rank: true,
        playTime: true,
      },
    });

    const blocks = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        blockedBy: true,
      },
    });
    return users.filter((u) => !blocks.blockedBy.includes(u.id));
  }

  async findOne(id: string, userId: string) {
    if (id === userId) {
      return new UserEntity(
        await this.prismaService.user.findUnique({
          where: {
            id,
          },
        }),
      );
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        score: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new HttpException('User not found', 404);
    const blocks = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        blockedBy: true,
      },
    });
    if (blocks.blockedBy.includes(user.id)) {
      if (!user) throw new HttpException('User not found', 404);
    }
    return user;
  }

  async updateUsername(
    id: string,
    updateUserDto: UpdateUsernameDto,
  ): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        name: updateUserDto.username,
      },
    });
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  async updateEmail(id: string, updateUserDto: UpdateEmailDto): Promise<User> {
    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updateUserDto,
      },
    });
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  async search(name: string, userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        blockedBy: true,
      },
    });

    const users = await this.prismaService.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        score: true,
        createdAt: true,
        updatedAt: true,
        wins: true,
        losses: true,
        rank: true,
        playTime: true,
      },
    });

    return users.filter((u) => !user.blockedBy.includes(u.id));
  }

  async editAvatar(file: Express.Multer.File, userId: string) {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl: file.path,
      },
    });
    if (!user) throw new HttpException('User not found', 404);
    return user;
  }

  async userAvatar(@Res() res, userId: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        avatarUrl: true,
      },
    });
    if (!user) throw new HttpException('User not found', 404);
    return res.sendFile(user.avatarUrl.split('/')[1], {
      root: './upload',
    });
  }

  async leaderboard(id: string) {
    const users = await this.prismaService.user.findMany({
      orderBy: {
        score: 'desc',
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        score: true,
        createdAt: true,
        updatedAt: true,
        wins: true,
        losses: true,
        rank: true,
        playTime: true,
      },
    });
    const blocks = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        blockedBy: true,
      },
    });
    return users.filter((u) => !blocks.blockedBy.includes(u.id));
  }

  async friends(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        friends: true,
        blockedBy: true,
      },
    });

    const friendsUser = await this.prismaService.user.findMany({
      where: {
        id: {
          in: user.friends,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        score: true,
        createdAt: true,
        updatedAt: true,
        wins: true,
        losses: true,
        rank: true,
        playTime: true,
      },
    });
    return friendsUser.filter((u) => !user.blockedBy.includes(u.id));
  }

  async requests(id: string) {
    const requestsIds = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        friendRequests: true,
      },
    });

    const requests = await this.prismaService.user.findMany({
      where: {
        id: {
          in: requestsIds.friendRequests,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        score: true,
        createdAt: true,
        updatedAt: true,
        wins: true,
        losses: true,
        rank: true,
        playTime: true,
      },
    });
    return requests;
  }

  async sendRequest(id: string, userId: string): Promise<User> {
    if ((await this.allowed(id, userId, Actions.sendRequest)) === false) {
      throw new HttpException('Bad request', 400);
    }

    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        friendRequestsSent: {
          push: userId,
        },
      },
    });

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        friendRequests: {
          push: id,
        },
      },
    });
    return user;
  }

  async acceptRequest(id: string, userId: string): Promise<User> {
    if ((await this.allowed(id, userId, Actions.acceptRequest)) === false) {
      throw new HttpException('Bad request', 400);
    }

    const { friendRequests } = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        friendRequests: {
          set: friendRequests.filter((d) => d !== userId),
        },
        friends: {
          push: userId,
        },
      },
    });

    const { friendRequestsSent } = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friendRequestsSent: true,
      },
    });

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        friendRequestsSent: {
          set: friendRequestsSent.filter((d) => d !== id),
        },
        friends: {
          push: id,
        },
      },
    });

    return user;
  }

  async declineRequest(id: string, userId: string): Promise<User> {
    if ((await this.allowed(id, userId, Actions.declineRequest)) === false) {
      throw new HttpException('Bad request', 400);
    }

    const { friendRequests } = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        friendRequests: {
          set: friendRequests.filter((d) => d !== userId),
        },
      },
    });

    return user;
  }

  async blockUser(id: string, userId: string): Promise<User> {
    if ((await this.allowed(id, userId, Actions.blockUser)) === false) {
      throw new HttpException('Bad request', 400);
    }

    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        blockedUsers: {
          push: userId,
        },
      },
    });

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        blockedBy: {
          push: id,
        },
      },
    });
    return user;
  }

  async unblockUser(id: string, userId: string): Promise<User> {
    if ((await this.allowed(id, userId, Actions.unblockUser)) === false) {
      throw new HttpException('Bad request', 400);
    }

    const { blockedUsers } = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        blockedUsers: true,
      },
    });

    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        blockedUsers: {
          set: blockedUsers.filter((d) => d !== userId),
        },
      },
    });

    const { blockedBy } = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        blockedBy: true,
      },
    });

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        blockedBy: {
          set: blockedBy.filter((d) => d !== id),
        },
      },
    });
    return user;
  }

  async removeFriend(id: string, userId: string): Promise<User> {
    if ((await this.allowed(id, userId, Actions.removeFriend)) === false) {
      throw new HttpException('Bad request', 400);
    }

    const { friends } = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        friends: true,
      },
    });

    const user = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        friends: {
          set: friends.filter((d) => d !== userId),
        },
      },
    });

    const { friends: friends2 } = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        friends: true,
      },
    });

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        friends: {
          set: friends2.filter((d) => d !== id),
        },
      },
    });
    return user;
  }

  async enableTwoFactorAuthentication(userId: string, res: Response) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorEnabled: true,
        },
      });

      return res.status(201).send('2FA enabled');
    } catch (error) {}
    return null;
  }
  async profile(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        score: true,
        createdAt: true,
        updatedAt: true,
        wins: true,
        losses: true,
        rank: true,
        playTime: true,
        gamesHistory: true,
        blockedUsers: true,
        blockedBy: true,
        friends: true,
        friendRequests: true,
        friendRequestsSent: true,
      },
    });
    return user;
  }
  async toggleTwoFactorAuthentication(secret: string, userId: string) {
    try {
      await this.prismaService.user.update({
        where: {
          id: userId,
        },
        data: {
          twoFactorSecret: secret,
          twoFactorEnabled: false,
        },
      });
    } catch (error) {}
    return null;
  }

  async allowed(id: string, userId: string, action: Actions) {
    const userA = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      select: {
        blockedUsers: true,
        friends: true,
        friendRequests: true,
        blockedBy: true,
        friendRequestsSent: true,
      },
    });

    const userB = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userA || !userB) return false;

    switch (action) {
      case Actions.sendRequest:
        if (
          userA.friendRequestsSent.includes(userId) ||
          userA.blockedUsers.includes(userId) ||
          userA.friends.includes(userId) ||
          userA.friendRequests.includes(userId) ||
          userA.blockedBy.includes(userId) ||
          id === userId
        ) {
          return false;
        }
        break;
      case Actions.acceptRequest:
        if (
          userA.blockedUsers.includes(userId) ||
          userA.blockedBy.includes(userId) ||
          userA.friends.includes(userId) ||
          !userA.friendRequests.includes(userId)
        ) {
          return false;
        }
        break;
      case Actions.declineRequest:
        if (!userA.friendRequests.includes(userId)) return false;
        break;
      case Actions.blockUser:
        if (userA.blockedUsers.includes(userId)) {
          return false;
        }
        break;
      case Actions.unblockUser:
        if (!userA.blockedUsers.includes(userId)) {
          return false;
        }
        break;
      case Actions.removeFriend:
        if (!userA.friends.includes(userId)) {
          return false;
        }
        break;
      default:
        return true;
    }
  }
}
