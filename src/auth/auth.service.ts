import { UserCreation } from './../user/user.dto';
import { UserRole } from './../user/user.entity';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InvalidToken } from './auth.entity';
import { VerifyTokenBody } from './auth.request';
import { UserService } from '../user/user.service';
import { AuthUser } from './auth-user.decorator';
import { User } from '../user/user.entity';
import { validate } from 'class-validator';
import { compareSync, hashSync } from 'bcrypt';
import { JWT_SALT } from 'src/utils';
import {
  ILoginResponse,
  ResetPassRequest,
  ResetPassResponse,
} from './auth.dto';
import { sign } from 'jsonwebtoken';
import { isEmpty } from 'lodash';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  async validateUser(
    username: string,
    password: string,
  ): Promise<ILoginResponse> {
    const user = await this.userService.findSingleBy(
      { username },
      {
        select: [
          'id',
          'avatar',
          'email',
          'name',
          'password',
          'username',
          'role',
        ],
      },
    );
    if (!user || !compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid username or password');
    } else {
      const token = sign({ userId: user.id }, JWT_SALT);
      return {
        token,
        user,
      };
    }
  }
  async verifyToken(body: VerifyTokenBody, authUser: AuthUser): Promise<User> {
    await validate(body);
    const user = await this.userService.findSingleBy({ id: authUser.id });
    if (user?.id !== body.userId) throw new InvalidToken();
    return user;
  }
  async validateUserJWT(userId: string): Promise<any> {
    const user = await this.userService.findSingleBy({ id: userId });
    if (isEmpty(user)) throw new InvalidToken();
    return user;
  }
  async resetPassword(
    resquestUser: ResetPassRequest,
  ): Promise<ResetPassResponse> {
    try {
      const user = await this.userService.findSingleBy({
        username: resquestUser.username,
      });
      if (!user || user.email !== resquestUser.email) {
        throw new NotFoundException('Invalid user information!');
      }
      const password = hashSync(resquestUser.password, 10);
      return this.userService.update(user.id, { password });
    } catch (err) {
      throw new InternalServerErrorException('Internal Error.');
    }
  }
  async resetPasswordAdminRight(
    authUser: AuthUser,
    resquestUser: ResetPassRequest,
  ): Promise<ResetPassResponse> {
    // Xac nhan thong tin can thiet o day, nhu ma OTP dien thoai de cho phep reset
    return this.userService.verifyAndPerformAdminAction(authUser, async () => {
      const user = await this.userService.findSingleBy({
        username: resquestUser.username,
      });
      if (!user) {
        throw new NotFoundException(
          'There is no user with the given username.',
        );
      }
      const password = hashSync(resquestUser.password, 10);
      return this.userService.update(user.id, { password });
    });
  }
  async signUp(newUser: UserCreation): Promise<any> {
    const user = await this.userService.findSingleBy({
      username: newUser.username,
    });
    if (user) {
      throw new ConflictException('User has been created');
    }

    return this.userService.verifyAndCreateNewUser(newUser);
  }
}
