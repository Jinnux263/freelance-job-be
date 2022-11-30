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
import { ApiTags } from '@nestjs/swagger';
import { AuthUser, Public } from 'src/auth/auth-user.decorator';
import { PostService } from 'src/post/post.service';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Post API')
@Controller('post')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService,
  ) {}

  @Post(':postId/comment')
  makeComment(
    @Request() request: { user: AuthUser },
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createCommentToPost(
      request.user,
      postId,
      createCommentDto,
    );
  }

  @Get(':postId/comment')
  @Public()
  getCommentsInPost(@Param('postId') id: string) {
    return this.postService.getCommentsInPost(id);
  }

  // @Get('comment/:commentId/reply')
  // @Public()
  // getReplyComment(@Param('commentId') id: string) {
  //   return this.commentService.getReplyComment(id);
  // }

  @Post('comment/:commentId')
  replyComment(
    @Request() request: { user: AuthUser },
    @Param('commentId') commentId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createCommentToComment(
      request.user,
      commentId,
      createCommentDto,
    );
  }

  @Patch('comment/:commentId')
  modifyComment(
    @Request() request: { user: AuthUser },

    @Param('commentId') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(
      request.user,
      id,
      updateCommentDto,
    );
  }

  @Delete('comment/:commentId')
  removeComment(
    @Request() request: { user: AuthUser },
    @Param('commentId') id: string,
  ) {
    return this.commentService.removeComment(request.user, id);
  }
}
