import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Headers,
  Patch,
  Delete,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserCreation, UserUpdation } from './user.dto';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUser, Public } from 'src/auth/auth-user.decorator';
import { BaseResponse } from 'src/base/base.dto';
import { UserPost } from 'src/post/post.entity';

@ApiTags('Users Management')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUser(
    @Param('id') id: string,
    @Request() request: { user: AuthUser },
  ): Promise<Partial<User>> {
    return this.userService.getUserById(request.user, id);
  }

  @Get('')
  @ApiTags('Admin Only')
  @ApiOkResponse({
    description: 'List of all users',
    type: User,
    isArray: true,
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Current user is not an admin',
  })
  getUsers(@Request() request: { user: AuthUser }): Promise<User[]> {
    return this.userService.getAllUsers(request.user);
  }

  @Post('')
  @ApiTags('Admin Only')
  @ApiCreatedResponse({
    description: 'A new user has been created',
    type: User,
  })
  @ApiUnauthorizedResponse({
    description: 'Current user is not an admin',
  })
  @ApiBearerAuth()
  createUser(
    @Request() request: { user: AuthUser },
    @Body() body: UserCreation,
  ): Promise<User> {
    return this.userService.createNewUser(request.user, body);
  }

  // @Post('admin')
  // @ApiExcludeEndpoint()
  // @Public()
  // createAdminUser(
  //   @Headers() headers: Record<string, string>,
  //   @Body() body: UserCreation,
  // ): Promise<User> {
  //   return this.userService.createAdminUser(headers['secret'], body);
  // }

  @Patch(':id')
  @ApiAcceptedResponse({
    description: `User has been successfully updated`,
    type: UserUpdation,
  })
  @ApiUnauthorizedResponse({
    description: 'Current user is not an admin',
  })
  @ApiBearerAuth()
  updateUser(
    @Request() request: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: UserUpdation,
  ) {
    return this.userService.updateUserInfor(request.user, id, body);
  }

  @Delete(':id')
  @ApiTags('Admin Only')
  @ApiAcceptedResponse({
    description: `User has been delete successfully`,
    type: BaseResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Current user is not an admin',
  })
  @ApiBearerAuth()
  removeUser(@Request() request: { user: AuthUser }, @Param('id') id: string) {
    return this.userService.deleteUser(request.user, id);
  }

  @Get('liked-posts/all')
  getLikedPosts(@Request() request: { user: AuthUser }): Promise<UserPost[]> {
    return this.userService.getLikedPosts(request.user);
  }
}
