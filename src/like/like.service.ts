import { Injectable } from '@nestjs/common';
import { PostService } from 'src/post/post.service';
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
