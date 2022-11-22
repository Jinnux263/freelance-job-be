import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPost } from './post.entity';
import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserPost])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
