import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { BaseResponse } from 'src/base/base.dto';
import { BaseService } from 'src/base/base.service';
import { Comment } from 'src/comment/entities/comment.entity';
import { PostService } from 'src/post/post.service';
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
    private readonly postService: PostService,
  ) {
    super(commentRepository, IdPrefix.COMMENT);
  }

  async createComment(postId: string, createCommentDto: CreateCommentDto) {
    try {
      const post = await this.postService.findSingleBy({ id: postId });
      const newPost = new Comment({
        ...createCommentDto,
        post: post,
      });
      const createdPost = await this.create(newPost);

      return createdPost;
    } catch (err) {
      throw new InternalServerErrorException('Can not create new Post');
    }
  }

  async findAllComments() {
    return await this.findAll();
  }

  async findOne(id: string) {
    const comment = await this.findById(id);
    if (!comment) {
      throw new NotFoundException('Could not find comment');
    }
    return comment;
  }

  async updateComment(id: string, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.findById(id);
      if (!comment) {
        throw new NotFoundException('There is no comment');
      }
      try {
        const newComment = await this.commentRepository.update(
          id,
          updateCommentDto,
        );
        // Todo: Return comment sau khi da cap nhat
        return updateCommentDto;
      } catch (e) {
        console.log(e.message);
      }
    } catch (err) {
      throw new InternalServerErrorException('Internal Error');
    }
  }

  async removeComment(id: string) {
    try {
      const comment = await this.findById(id);
      if (!comment) {
        throw new NotFoundException('Can not delete comment');
      }
      await this.deleteById(id);
      return new BaseResponse(200, 'Delete comment successfully');
    } catch (err) {
      throw new InternalServerErrorException('Internal Error');
    }
  }

  async getReplyComment(commentId: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: {
        replyComment: true,
      },
    });
    if (!comment) {
      throw new NotFoundException('Comment is not existed');
    }
    return comment;
  }
}
