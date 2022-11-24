import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BaseService } from 'src/base/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdPrefix } from 'src/utils';
import { PostType, UserPost } from 'src/post/post.entity';
import { PostCreation, PostRequest } from 'src/post/post.dto';
import { UserService } from 'src/user/user.service';

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
  ): Promise<any> {
    try {
      const user = await this.userService.findSingleBy({ id: authUser.id });
      const newPost = new UserPost({
        type: PostType.PUBLIC,
        ...postCreation,
        owner: user,
      });
      newPost.owner = user;

      const createdUser = await this.create(newPost);
      return createdUser;
    } catch (err) {
      throw new InternalServerErrorException('Can not create new Post');
    }
  }

  async getPostById(authUser: AuthUser, id: string): Promise<any> {
    return 'OK';
  }
  async getPosts(authUser: AuthUser): Promise<any> {
    return 'OK';
  }
  async getPostOfUser(authUser: AuthUser, userId: string): Promise<any> {
    return 'OK';
  }
  async updatePost(authUser: AuthUser, id: string, body: any): Promise<any> {
    return 'OK';
  }
  async deletePost(authUser: AuthUser, id: string): Promise<any> {
    return 'OK';
  }
}
