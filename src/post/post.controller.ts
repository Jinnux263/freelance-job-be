import { AuthUser, Public } from 'src/auth/auth-user.decorator';
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
import { PostCreation, PostUpdation } from 'src/post/post.dto';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Post API')
@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  @Post('')
  createPost(
    @Request() request: { user: AuthUser },
    @Body() body: PostCreation,
  ): Promise<UserPost> {
    return this.postService.createPost(request.user, body);
  }

  @Get(':id')
  @Public()
  getPost(
    @Param('id') id: string,
    @Request() request: { user: AuthUser },
  ): Promise<Partial<UserPost>> {
    return this.postService.getPostById(request.user, id);
  }

  @Get('user/:id')
  @Public()
  getPostsOfUser(@Param('id') id: string): Promise<User> {
    return this.userService.getPostsOfUser(id);
  }

  // Todo: Chuyen qua ben user
  @Get('liked-posts/all')
  getLikedPosts(@Request() request: { user: AuthUser }): Promise<UserPost[]> {
    return this.userService.getLikedPosts(request.user);
  }

  @Get('')
  @Public()
  getPosts(@Request() request: { user: AuthUser }): Promise<UserPost[]> {
    return this.postService.getPosts(request.user);
  }

  @Patch(':id')
  updatePost(
    @Request() request: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: PostUpdation,
  ) {
    return this.postService.updatePost(request.user, id, body);
  }

  @Delete(':id')
  removePost(@Request() request: { user: AuthUser }, @Param('id') id: string) {
    return this.postService.deletePost(request.user, id);
  }
}
