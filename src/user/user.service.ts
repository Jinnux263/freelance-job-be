import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
import {
  UserRequest,
  UserCreation,
  UserUpdation,
  UserSelfUpdation,
} from './user.dto';
import { IdPrefix, ADMIN_SECRET } from 'src/utils';
import { BaseService } from 'src/base/base.service';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { isEmpty, pick } from 'lodash';
import { hashSync } from 'bcrypt';
import { BaseResponse } from 'src/base/base.dto';
import { UserPost } from 'src/post/post.entity';

@Injectable()
export class UserService extends BaseService<User, UserCreation, UserRequest> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(userRepository, IdPrefix.USER);
  }

  async createNewUser(
    authUser: AuthUser,
    newUser: UserCreation,
  ): Promise<User> {
    return this.verifyAndPerformAdminAction(authUser, () =>
      this.verifyAndCreateNewUser(newUser),
    );
  }

  // async createAdminUser(
  //   secretCode: string,
  //   newUser: UserCreation,
  // ): Promise<User> {
  //   // TODO: Move to env
  //   if (secretCode === ADMIN_SECRET) {
  //     newUser.role = UserRole.ADMIN;
  //     return this.verifyAndCreateNewUser(newUser);
  //   } else {
  //     throw new UnauthorizedException('Wrong Secret Code');
  //   }
  // }

  async verifyAndCreateNewUser(newUser: UserCreation): Promise<User> {
    const existedUser = await this.findSingleBy({ username: newUser.username });
    if (isEmpty(existedUser)) {
      newUser.password = hashSync(newUser.password, 10);
      const createdUser = await this.create(newUser);
      return createdUser;
    } else {
      throw new ConflictException('Username Already Exist');
    }
  }

  async getAllUsers(authUser: AuthUser): Promise<Partial<User[]>> {
    // const users = await this.verifyAndPerformAdminAction(authUser, () =>
    //   this.findAll(),
    // );
    const users = await this.findAll();
    const filterUsers = users.map((user) =>
      pick(user, [
        'id',
        'username',
        'avatar',
        'firstName',
        'lastName',
        'role',
        'organization',
        'address',
        'city',
        'country',
      ]),
    );
    return filterUsers;
  }

  async getUserById(
    authUser: AuthUser,
    userId: string,
  ): Promise<Partial<User>> {
    const currentUser = await this.findSingleBy({ id: authUser.id });
    if (isEmpty(currentUser)) {
      throw new UnauthorizedException('Token Invalid');
    } else {
      const queryUser = await this.findById(userId);
      return currentUser.role === UserRole.ADMIN || currentUser.id === userId
        ? queryUser
        : pick(currentUser, [
            'id',
            'username',
            'avatar',
            'organization',
            'firstName',
            'lastName',
            'role',
            'address',
            'city',
            'country',
          ]);
    }
  }

  async verifyAndPerformAdminAction<T>(
    authUser: AuthUser,
    action: () => Promise<T>,
  ): Promise<T> {
    const currentUser = await this.findSingleBy({ id: authUser.id });
    if (currentUser?.role === UserRole.ADMIN) {
      return action();
    } else {
      throw new UnauthorizedException(
        'Current user is not an admin or token is invalid',
      );
    }
  }

  async updateUserInfor(
    authUser: AuthUser,
    userId: string,
    userUpdate: UserUpdation,
  ): Promise<User> {
    if (authUser.id === userId) {
      return this.updateSelfUserInfor(authUser, userUpdate);
    } else {
      const users = await this.verifyAndPerformAdminAction(
        authUser,
        async () => {
          const updateUser = await this.findSingleBy({ id: userId });
          if (isEmpty(updateUser)) {
            throw new NotFoundException(`There is no user with id ${userId}`);
          }
          return this.update(userId, userUpdate);
        },
      );
      return users;
    }
  }

  async updateSelfUserInfor(
    authUser: AuthUser,
    userUpdate: UserSelfUpdation,
  ): Promise<User> {
    const currentUser = await this.findSingleBy({ id: authUser.id });
    if (isEmpty(currentUser)) {
      throw new UnauthorizedException('Token Invalid');
    }
    return this.update(authUser.id, userUpdate);
  }

  async deleteUser(authUser: AuthUser, userId: string): Promise<any> {
    return this.verifyAndPerformAdminAction(authUser, async () => {
      // Todo: Xoa het post, xoa het poll, like, comment roi moi xoa user
      // 1 - Xoa like, comment va vote truoc roi moi toi 2
      // 2 - Xoa post va poll
      try {
        await this.removeAllLikeOfUser(userId);
      } catch (err) {
        throw new InternalServerErrorException(
          'Can not remove all Like of user',
        );
      }

      try {
        await this.removeAllVoteOfUser(userId);
      } catch (err) {
        throw new InternalServerErrorException(
          'Can not remove all Vote of user',
        );
      }

      try {
        await this.removeAllCommentOfUser(userId);
      } catch (err) {
        throw new InternalServerErrorException(
          'Can not remove all Comment of user',
        );
      }

      // Todo: Xoa user
      const user = await this.findSingleBy(
        { id: userId },
        {
          relations: {
            createdPosts: true,
            votedPollAnswer: true,
          },
        },
      );
      try {
        await this.deleteById(userId);
        return new BaseResponse(
          200,
          `Delete user with id ${userId} successfully.`,
        );
      } catch (err) {
        console.log(err.message);
        throw new InternalServerErrorException('Delete user failed', err);
      }
    });
  }

  async getLikedPosts(authUser: AuthUser): Promise<UserPost[]> {
    const posts = await this.userRepository.findOne({
      where: {
        id: authUser.id,
      },
      relations: {
        likedPosts: true,
      },
    });

    return posts.likedPosts;
  }

  async getPostsOfUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: {
        createdPosts: true,
      },
    });

    return user;
  }

  async getPostRequestsOfUser(
    authUser: AuthUser,
    userId: string,
  ): Promise<User> {
    const seeker = await this.findById(authUser.id);
    if (seeker.role === UserRole.ADMIN || seeker.id === userId) {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
        relations: {
          createdPostRequest: true,
        },
      });
      return user;
    }
    throw new UnauthorizedException('Can not do this task');
  }

  private async removeAllLikeOfUser(userId: string): Promise<any> {
    const user = await this.findSingleBy(
      { id: userId },
      {
        relations: { likedPosts: true },
      },
    );
    user.likedPosts = [];
    try {
      return await this.userRepository.save(user);
    } catch (err) {
      console.log(err.message);
      throw new ConflictException('Can not delete all Like');
    }
  }

  private async removeAllVoteOfUser(userId: string): Promise<any> {
    const user = await this.findSingleBy(
      { id: userId },
      {
        relations: { votedPollAnswer: true },
      },
    );
    user.votedPollAnswer = [];
    try {
      return await this.userRepository.save(user);
    } catch (err) {
      console.log(err.message);
      throw new ConflictException('Can not delete all Vote');
    }
  }

  // Todo: Khong xoa het comment duoc
  private async removeAllCommentOfUser(userId: string): Promise<any> {
    const user = await this.findSingleBy(
      { id: userId },
      {
        relations: { comments: true },
      },
    );
    user.comments = [];
    try {
      return await this.userRepository.save(user);
    } catch (err) {
      console.log(err.message);
      throw new ConflictException('Can not delete all Comment');
    }
  }
}
