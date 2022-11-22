import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserPost } from './post.entity';
import { PostService } from './post.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseResponse } from 'src/base/base.dto';
import { PostCreation, PostUpdation } from 'src/post/post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  getUser(
    @Param('id') id: string,
    @Request() request: { authUser: AuthUser },
  ): Promise<Partial<UserPost>> {
    return this.postService.getPostById(request.authUser, id);
  }

  @Get('')
  @ApiTags('Admin Only')
  @ApiOkResponse({
    description: 'List of all users',
    type: UserPost,
    isArray: true,
  })
  @ApiBearerAuth()
  @ApiUnauthorizedResponse({
    description: 'Current post is not an admin',
  })
  getUsers(@Request() request: { authUser: AuthUser }): Promise<UserPost[]> {
    return this.postService.getPosts(request.authUser);
  }

  @Post('')
  @ApiTags('Admin Only')
  @ApiCreatedResponse({
    description: 'A new post has been created',
    type: UserPost,
  })
  @ApiUnauthorizedResponse({
    description: 'Current post is not an admin',
  })
  @ApiBearerAuth()
  createUser(
    @Request() request: { authUser: AuthUser },
    @Body() body: PostCreation,
  ): Promise<UserPost> {
    return this.postService.createPost(request.authUser, body);
  }

  @Patch(':id')
  @ApiAcceptedResponse({
    description: `Post has been successfully updated`,
    type: PostUpdation,
  })
  @ApiUnauthorizedResponse({
    description: 'Current post is not an admin',
  })
  @ApiBearerAuth()
  updateUser(
    @Request() request: { authUser: AuthUser },
    @Param('id') id: string,
    @Body() body: PostUpdation,
  ) {
    return this.postService.updatePost(request.authUser, id, body);
  }

  @Delete(':id')
  @ApiTags('Admin Only')
  @ApiAcceptedResponse({
    description: `Post has been delete successfully`,
    type: BaseResponse,
  })
  @ApiUnauthorizedResponse({
    description: 'Current post is not an admin',
  })
  @ApiBearerAuth()
  removeUser(
    @Request() request: { authUser: AuthUser },
    @Param('id') id: string,
  ) {
    return this.postService.deletePost(request.authUser, id);
  }
}
