import { PostModule } from 'src/post/post.module';
import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Comment } from 'src/comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserModule, PostModule],
  exports: [CommentService],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
