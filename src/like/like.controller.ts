import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Like } from 'src/like/entities/like.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserPost } from 'src/post/post.entity';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':postId')
  @ApiTags('Admin Only')
  @ApiCreatedResponse({
    description: 'A new post has been created',
    type: Like,
  })
  @ApiUnauthorizedResponse({
    description: 'Current post is not an admin',
  })
  @ApiBearerAuth()
  like(
    @Request() request: { user: AuthUser },
    @Param('postId') postId: string,
  ): Promise<UserPost> {
    const like = this.likeService.like(request.user.id, postId);
    return like;
  }

  @Delete(':postId')
  @ApiTags('Admin Only')
  @ApiCreatedResponse({
    description: 'Post has been unliked',
    type: Like,
  })
  @ApiUnauthorizedResponse({
    description: 'Current post is not an admin',
  })
  @ApiBearerAuth()
  unlikePost(
    @Request() request: { user: AuthUser },
    @Param('postId') postId: string,
  ): Promise<any> {
    const like = this.likeService.unlike(request.user.id, postId);
    return like;
  }
}
