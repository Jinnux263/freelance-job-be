import { AuthUser, Public } from 'src/auth/auth-user.decorator';
import { APPROVE_STATUS, PostRequest } from './post-request.entity';
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

@ApiTags('Post Request API')
@Controller('post-request')
export class PostRequestController {
  constructor(
    private readonly postRequestService: PostRequestService,
    private readonly userService: UserService,
  ) {}

  @Post('')
  createPost(
    @Request() request: { user: AuthUser },
    @Body() body: PostRequestCreation,
    // ): Promise<PostRequest> {
  ): Promise<any> {
    return this.postRequestService.createPostRequest(request.user, body);
  }

  @Get(':id')
  getPost(
    @Param('id') id: string,
    @Request() request: { user: AuthUser },
  ): Promise<Partial<PostRequest>> {
    return this.postRequestService.getPostRequestById(request.user, id);
  }

  @Get('user/:userId')
  getPostsOfUser(
    @Request() request: { user: AuthUser },
    @Param('userId') id: string,
  ): Promise<User> {
    console.log('Seeking');

    return this.userService.getPostRequestsOfUser(request.user, id);
  }

  @Get('')
  getPosts(@Request() request: { user: AuthUser }): Promise<PostRequest[]> {
    return this.postRequestService.getPostRequests(request.user);
  }

  // @Get('post-request/approved/all')
  // getApprovedPosts(
  //   @Request() request: { user: AuthUser },
  // ): Promise<PostRequest[]> {
  //   return this.postRequestService.getPostRequests(request.user, {
  //     isApproved: APPROVE_STATUS.APPROVED,
  //   });
  // }

  @Patch(':id')
  updatePost(
    @Request() request: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: PostRequestUpdation,
  ) {
    return this.postRequestService.updatePostRequest(request.user, id, body);
  }

  @Delete(':id')
  removePost(@Request() request: { user: AuthUser }, @Param('id') id: string) {
    return this.postRequestService.deletePostRequest(request.user, id);
  }
}
