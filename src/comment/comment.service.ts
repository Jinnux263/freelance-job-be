import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { BaseResponse } from 'src/base/base.dto';
import { BaseService } from 'src/base/base.service';
import { Comment } from 'src/comment/entities/comment.entity';
import { PostService } from 'src/post/post.service';
import { UserRole } from 'src/user/user.entity';
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

  async createCommentToPost(
    authUser: AuthUser,
    postId: string,
    createCommentDto: CreateCommentDto,
  ) {
    try {
      const user = await this.userService.findSingleBy({ id: authUser.id });
      if (!user) {
        throw new NotFoundException('There is no user');
      }

      const post = await this.postService.findSingleBy({ id: postId });
      if (!post) {
        throw new InternalServerErrorException('There is no post');
      }
      const newComment = new Comment({
        ...createCommentDto,
        post: post,
        owner: user,
      });
      const createdComment = await this.create(newComment);
      return createdComment;
    } catch (err) {
      throw new InternalServerErrorException('Can not create new Comment');
    }
  }

  async createCommentToComment(
    authUser: AuthUser,
    commentId: string,
    createCommentDto: CreateCommentDto,
  ) {
    try {
      const user = await this.userService.findSingleBy({ id: authUser.id });
      if (!user) {
        throw new NotFoundException('There is no user');
      }

      const comment = await this.findSingleBy({ id: commentId });
      const newComment = new Comment({
        ...createCommentDto,
        replyToComment: comment,
        owner: user,
      });
      const createdComment = await this.create(newComment);
      return createdComment;
    } catch (err) {
      throw new InternalServerErrorException('Can not create new Comment');
    }
  }

  async findAllComments() {
    return await this.findAll();
  }

  async findOne(id: string) {
    const comment = await this.findSingleBy(
      { id },
      {
        relations: {
          owner: true,
        },
      },
    );
    if (!comment) {
      throw new NotFoundException('Could not find comment');
    }
    return comment;
  }

  async updateComment(
    authUser: AuthUser,
    id: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const user = await this.userService.findSingleBy({ id: authUser.id });
    const comment = await this.findSingleBy(
      { id },
      {
        relations: {
          owner: true,
        },
      },
    );
    if (!comment) {
      throw new NotFoundException('There is no comment');
    }
    if (comment.owner.id != authUser.id && user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('You can not do this action');
    }
    try {
      const newComment = await this.commentRepository.update(
        id,
        updateCommentDto,
      );
      return updateCommentDto;
    } catch (err) {
      throw new ConflictException('Update comment failed');
    }
  }

  async removeComment(authUser: AuthUser, id: string) {
    const user = await this.userService.findSingleBy({ id: authUser.id });
    const comment = await this.findSingleBy(
      { id },
      {
        relations: {
          owner: true,
        },
      },
    );
    if (!comment) {
      throw new NotFoundException('There is no comment');
    }
    if (comment.owner.id != authUser.id && user.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('You can not do this action');
    }
    try {
      await this.deleteById(id);
      return new BaseResponse(200, 'Delete comment successfully');
    } catch (err) {
      console.log(err.message);

      throw new ConflictException('Delete comment failed');
    }
  }

  // async getReplyComment(commentId: string): Promise<Comment> {
  //   const comment = await this.commentRepository.findOne({
  //     where: { id: commentId },
  //     relations: {
  //       replyComment: true,
  //     },
  //   });
  //   if (!comment) {
  //     throw new NotFoundException('Comment is not existed');
  //   }
  //   return comment;
  // }
}
