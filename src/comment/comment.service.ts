import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/base/base.service';
import { Comment } from 'src/comment/entities/comment.entity';
import { UserService } from 'src/user/user.service';
import { IdPrefix } from 'src/utils';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService extends BaseService<
  Comment,
  CreateCommentDto,
  UpdateCommentDto
> {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
  ) {
    super(commentRepository, IdPrefix.COMMENT);
  }

  createComment(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAllComments() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  updateComment(id: string, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  removeComment(id: string) {
    return `This action removes a #${id} comment`;
  }
}
