import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [UserModule, PostModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
