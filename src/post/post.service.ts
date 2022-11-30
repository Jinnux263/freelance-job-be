import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdPrefix } from 'src/utils';
import { PostType, UserPost } from 'src/post/post.entity';
import { PostCreation, PostRequest, PostUpdation } from 'src/post/post.dto';
import { UserService } from 'src/user/user.service';
import { BaseResponse } from 'src/base/base.dto';

@Injectable()
export class PostService extends BaseService<
  UserPost,
  PostCreation,
  PostRequest
> {
  constructor(
    @InjectRepository(UserPost)
    private readonly postRepository: Repository<UserPost>,
    private readonly userService: UserService,
  ) {
    super(postRepository, IdPrefix.POST);
  }
  async createPost(
    authUser: AuthUser,
    postCreation: PostCreation,
  ): Promise<UserPost> {
    try {
      const user = await this.userService.findSingleBy({ id: authUser.id });
      const newPost = new UserPost({
        type: PostType.PUBLIC,
        ...postCreation,
        owner: user,
      });
      const createdPost = await this.create(newPost);

      return createdPost;
    } catch (err) {
      throw new InternalServerErrorException('Can not create new Post');
    }
  }

  async getPostById(authUser: AuthUser, id: string): Promise<UserPost> {
    const post = await this.findById(id, {
      // relations: {
      //   likeUser: true,
      //   comment: true,
      //   owner: true,
      // },
      join: {
        alias: 'post',
        leftJoinAndSelect: {
          likeUser: 'post.likeUser',
          owner: 'post.owner',
          comment: 'post.comment',
          replycomment: 'comment.replyComment',
        },
      },
    });
    if (!post) {
      throw new NotFoundException('Could not find post');
    }
    return post;
  }

  async getPosts(authUser: AuthUser): Promise<UserPost[]> {
    const posts = await this.findAll();
    return posts;
  }

  async getLikesOfPost(postId: string): Promise<UserPost> {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: {
        likeUser: true,
      },
    });

    return post;
  }

  async getCommentsInPost(postId: string): Promise<UserPost> {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: {
        comment: true,
      },
    });
    if (!post) {
      throw new NotFoundException('There is no post');
    }
    return post;
  }

  async updatePost(
    authUser: AuthUser,
    id: string,
    updatePost: PostUpdation,
  ): Promise<UserPost> {
    try {
      const post = await this.findById(id);
      if (!post) {
        throw new NotFoundException('There is no post');
      }
      const newPost = await this.update(id, updatePost);
      return newPost;
    } catch (err) {
      throw new InternalServerErrorException('Internal Error');
    }
  }

  async deletePost(authUser: AuthUser, id: string): Promise<BaseResponse> {
    try {
      const post = await this.findById(id);
      if (!post) {
        throw new NotFoundException('Can not delete post');
      }
      await this.deleteById(id);
      return new BaseResponse(200, 'Delete post successfully');
    } catch (err) {
      throw new InternalServerErrorException('Internal Error');
    }
  }

  async likePost(userId: string, postId: string): Promise<UserPost> {
    try {
      const user = await this.userService.findSingleBy({ id: userId });

      try {
        const post = await this.findById(postId);
        post.addLikeUser(user);

        return await this.postRepository.save(post);
      } catch (err) {
        throw new NotFoundException('There is no such post');
      }
    } catch (err) {
      throw new InternalServerErrorException('Can not like post');
    }
  }

  async unlikePost(userId: string, postId: string): Promise<any> {
    try {
      const post = await this.getLikesOfPost(postId);

      try {
        post.likeUser = post.likeUser.filter((user) => {
          return userId != user.id;
        });
        return await this.postRepository.save(post);
      } catch (err) {
        throw new NotFoundException('There is no such post');
      }
    } catch (err) {
      throw new InternalServerErrorException('Can not unlike post');
    }
  }
}
