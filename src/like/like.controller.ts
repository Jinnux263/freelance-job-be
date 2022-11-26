import { Controller, Get, Post, Param, Delete, Request } from '@nestjs/common';
import { LikeService } from './like.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserPost } from 'src/post/post.entity';
import { PostService } from 'src/post/post.service';

@Controller('like')
export class LikeController {
  constructor(
    private readonly likeService: LikeService,
    private readonly postService: PostService,
  ) {}

  @Post(':postId')
  like(
    @Request() request: { user: AuthUser },
    @Param('postId') postId: string,
  ): Promise<UserPost> {
    const like = this.likeService.like(request.user.id, postId);
    return like;
  }

  @Delete(':postId')
  unlikePost(
    @Request() request: { user: AuthUser },
    @Param('postId') postId: string,
  ): Promise<any> {
    const like = this.likeService.unlike(request.user.id, postId);
    return like;
  }

  @Get('/:id')
  getLikeOfPost(@Param('id') id: string): Promise<UserPost> {
    return this.postService.getLikesOfPost(id);
  }
}
