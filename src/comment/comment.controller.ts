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
import { PostService } from 'src/post/post.service';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comment API')
@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly postService: PostService,
  ) {}

  @Post('post/:id')
  makeComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(id, createCommentDto);
  }

  @Get('post/:id')
  getCommentsInPost(@Param('id') id: string) {
    return this.postService.getCommentsInPost(id);
  }

  @Get('reply/:id')
  getReplyComment(@Param('id') id: string) {
    return this.commentService.getReplyComment(id);
  }

  @Patch(':id')
  modifyComment(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  @Delete(':id')
  removeComment(@Param('id') id: string) {
    return this.commentService.removeComment(id);
  }
}
