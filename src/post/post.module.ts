import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPost } from './post.entity';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { UserModule } from 'src/user/user.module';
import { PostRequestModule } from 'src/post_request/post-request.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPost]),
    UserModule,
    PostRequestModule,
  ],
  exports: [PostService],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
