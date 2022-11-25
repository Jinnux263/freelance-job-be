import { Injectable } from '@nestjs/common';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';

@Injectable()
export class LikeService {
  constructor(private readonly postService: PostService) {}

  like(userId: string, postId: string) {
    const res = this.postService.likePost(userId, postId);
    return res;
  }

  unlike(userId: string, postId: string) {
    const res = this.postService.unlikePost(userId, postId);
    return res;
  }
}
