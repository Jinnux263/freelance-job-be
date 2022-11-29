import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/auth-user.decorator';
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
    @Param('postId') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(id, createCommentDto);
  }

  @Get(':postId/comment')
  @Public()
  getCommentsInPost(@Param('postId') id: string) {
    return this.postService.getCommentsInPost(id);
  }

  @Get('comment/:commentId/reply')
  @Public()
  getReplyComment(@Param('commentId') id: string) {
    return this.commentService.getReplyComment(id);
  }

  @Patch('comment/:commentId')
  modifyComment(
    @Param('commentId') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  @Delete('comment/:commentId')
  removeComment(@Param('commentId') id: string) {
    return this.commentService.removeComment(id);
  }
}
