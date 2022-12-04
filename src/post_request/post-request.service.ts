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
import { UserService } from 'src/user/user.service';
import { BaseResponse } from 'src/base/base.dto';
import {
  APPROVE_STATUS,
  PostRequest,
  PostType,
} from 'src/post_request/post-request.entity';
import {
  PostRequestCreation,
  PostRequestDto,
  PostRequestUpdation,
} from 'src/post_request/post-request.dto';
import { UserRole } from 'src/user/user.entity';

@Injectable()
export class PostRequestService extends BaseService<
  PostRequest,
  PostRequestCreation,
  PostRequestDto
> {
  constructor(
    @InjectRepository(PostRequest)
    private readonly postRequestRepository: Repository<PostRequest>,
    private readonly userService: UserService,
  ) {
    super(postRequestRepository, IdPrefix.POST_REQUEST);
  }
  async createPostRequest(
    authUser: AuthUser,
    postCreation: PostRequestCreation,
  ): Promise<PostRequest> {
    try {
      const user = await this.userService.findSingleBy({ id: authUser.id });
      if (!postCreation.hashtag) {
        postCreation.hashtag = [];
      }
      const newPost = new PostRequest({
        type: PostType.PUBLIC,
        ...postCreation,
        owner: user,
        isApproved: false,
        hashtag: JSON.stringify(postCreation.hashtag),
      });

      // console.log(newPost);
      // return newPost;
      const createdPost = await this.create(newPost);

      createdPost.hashtag = JSON.parse(createdPost.hashtag);
      return createdPost;
    } catch (err) {
      console.log(err.message);

      throw new InternalServerErrorException('Can not create new Post');
    }
  }

  async getPostRequestById(
    authUser: AuthUser,
    id: string,
  ): Promise<PostRequest> {
    const post = await this.findSingleBy(
      { id, isApproved: false },
      {
        relations: {
          owner: true,
        },
      },
    );
    if (!post) {
      throw new NotFoundException('There is no post');
    }
    post.hashtag = JSON.parse(post.hashtag);
    return post;
  }

  async getPostRequests(
    authUser: AuthUser,
    options?: any,
  ): Promise<PostRequest[]> {
    const user = await this.userService.findSingleBy({ id: authUser.id });

    if (user.role === UserRole.ADMIN) {
      // return await this.findAll();
      const res = await this.postRequestRepository.find({
        where: {
          isApproved: false,
        },
        relations: {
          owner: true,
        },
      });
      res.map((postReq) => {
        postReq.hashtag = JSON.parse(postReq.hashtag);
      });
      return res;
    } else {
      const res = await this.postRequestRepository.find({
        where: {
          owner: {
            id: authUser.id,
          },
          // ...options,
          isApproved: false,
        },
        relations: {
          owner: true,
        },
      });
      res.map((postReq) => {
        postReq.hashtag = JSON.parse(postReq.hashtag);
      });
      return res;
    }
  }

  async updatePostRequest(
    authUser: AuthUser,
    id: string,
    updatePost: PostRequestUpdation,
  ): Promise<PostRequest> {
    if (!updatePost.hashtag) {
      updatePost.hashtag = [];
    }
    try {
      const post = await this.findById(id);
      if (!post || post.isApproved) {
        throw new NotFoundException('There is no post');
      }
      const newPost = await this.update(id, updatePost);
      return newPost;
    } catch (err) {
      throw new InternalServerErrorException('Internal Error');
    }
  }

  async deletePostRequest(
    authUser: AuthUser,
    id: string,
  ): Promise<BaseResponse> {
    try {
      const post = await this.findById(id);
      if (!post || post.isApproved) {
        throw new NotFoundException('There is no post');
      }

      await this.deleteById(id);
      return new BaseResponse(200, 'Delete post successfully');
    } catch (err) {
      throw new InternalServerErrorException('Internal Error');
    }
  }

  async approvePostRequest(
    authUser: AuthUser,
    postId: string,
  ): Promise<PostRequest> {
    return this.userService.verifyAndPerformAdminAction(authUser, async () => {
      const post = await this.postRequestRepository.findOneBy({ id: postId });
      post.isApproved = true;
      await this.postRequestRepository.save(post);
      return post;
    });
  }
}
