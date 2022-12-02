import { AuthUser, Public } from 'src/auth/auth-user.decorator';
import { PostRequest } from './post-request.entity';
import { PostRequestService } from './post-request.service';
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
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { ApiTags } from '@nestjs/swagger';
import {
  PostRequestCreation,
  PostRequestUpdation,
} from 'src/post_request/post-request.dto';

@ApiTags('Post API')
@Controller('post')
export class PostRequestController {
  constructor(
    private readonly postRequestService: PostRequestService,
    private readonly userService: UserService,
  ) {}

  @Post('')
  createPost(
    @Request() request: { user: AuthUser },
    @Body() body: PostRequestCreation,
  ): Promise<PostRequest> {
    return this.postRequestService.createPost(request.user, body);
  }

  @Get('post-request/:id')
  getPost(
    @Param('id') id: string,
    @Request() request: { user: AuthUser },
  ): Promise<Partial<PostRequest>> {
    return this.postRequestService.getPostById(request.user, id);
  }

  @Get('post-request/user/:userId')
  getPostsOfUser(
    @Request() request: { user: AuthUser },
    @Param('userId') id: string,
  ): Promise<User> {
    console.log('Seeking');

    return this.userService.getPostRequestsOfUser(request.user, id);
  }

  @Get('post-request')
  getPosts(@Request() request: { user: AuthUser }): Promise<PostRequest[]> {
    return this.postRequestService.getPosts(request.user);
  }

  @Patch('post-request/:id')
  updatePost(
    @Request() request: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: PostRequestUpdation,
  ) {
    return this.postRequestService.updatePost(request.user, id, body);
  }

  @Delete('post-request/:id')
  removePost(@Request() request: { user: AuthUser }, @Param('id') id: string) {
    return this.postRequestService.deletePost(request.user, id);
  }
}
