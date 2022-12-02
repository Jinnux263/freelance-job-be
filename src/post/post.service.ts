import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdPrefix } from 'src/utils';
import { PostType, UserPost } from 'src/post/post.entity';
import { PostCreation, PostRequest, PostUpdation } from 'src/post/post.dto';
import { UserService } from 'src/user/user.service';
import { BaseResponse } from 'src/base/base.dto';
import { UserRole } from 'src/user/user.entity';
import { PostRequestService } from 'src/post_request/post-request.service';
import { APPROVE_STATUS } from 'src/post_request/post-request.entity';

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
    private readonly postRequestService: PostRequestService,
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
  async approvePost(
    authUser: AuthUser,
    postRequestId: string,
  ): Promise<UserPost> {
    const adminUser = await this.userService.findSingleBy({ id: authUser.id });
    if (adminUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('User are not authorized');
    }
    const post = await this.postRequestService.findSingleBy({
      id: postRequestId,
      isApproved: false,
    });
    if (!post) {
      throw new NotFoundException('There is no such post');
    }

    const newPost = new UserPost({
      ...post,
    });

    try {
      const createdPost = await this.create(newPost);
      await this.postRequestService.approvePostRequest(authUser, postRequestId);
      return createdPost;
    } catch (err) {
      // console.log(err.message);
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
    const user = await this.userService.findSingleBy({ id: userId });

    const likedPost = await this.postRepository.findOne({
      where: {
        id: postId,
        likeUser: { id: user.id },
      },
      relations: {
        likeUser: true,
      },
    });
    if (likedPost) {
      return likedPost;
    }

    try {
      const post = await this.findById(postId, {
        relations: {
          likeUser: true,
        },
      });
      post.addLikeUser(user);
      return await this.postRepository.save(post);
    } catch (err) {
      console.log(err.message);
    }
  }

  async unlikePost(userId: string, postId: string): Promise<any> {
    const user = await this.userService.findSingleBy({ id: userId });

    const likedPost = await this.postRepository.findOne({
      where: {
        id: postId,
        likeUser: { id: user.id },
      },
      relations: {
        likeUser: true,
      },
    });
    if (!likedPost) {
      throw new NotFoundException('You did not like this post');
    }

    const post = await this.getLikesOfPost(postId);

    try {
      post.likeUser = post.likeUser.filter((user) => {
        return userId != user.id;
      });
      return await this.postRepository.save(post);
      // return await this.postRepository.remove(likedPost);
    } catch (err) {
      throw new NotFoundException('There is no such post');
    }
  }
}
