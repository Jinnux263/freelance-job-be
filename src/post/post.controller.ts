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
    @Request() request: { user: AuthUser },
    @Body() body: PostCreation,
  ): Promise<UserPost> {
    return this.postService.createPost(request.user, body);
  }

  @Get(':id')
  getUser(
    @Param('id') id: string,
    @Request() request: { user: AuthUser },
  ): Promise<Partial<UserPost>> {
    return this.postService.getPostById(request.user, id);
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
  getUsers(@Request() request: { user: AuthUser }): Promise<UserPost[]> {
    return this.postService.getPosts(request.user);
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
    @Request() request: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: PostUpdation,
  ) {
    return this.postService.updatePost(request.user, id, body);
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
  removeUser(@Request() request: { user: AuthUser }, @Param('id') id: string) {
    return this.postService.deletePost(request.user, id);
  }
}
