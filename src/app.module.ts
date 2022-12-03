import { UserPost } from './post/post.entity';
import { Poll } from './poll/entities/poll.entity';
import { User } from 'src/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PollModule } from './poll/poll.module';
import { PostModule } from './post/post.module';
import * as dotenv from 'dotenv';
import { get } from 'lodash';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { Comment } from 'src/comment/entities/comment.entity';
import { PostRequest } from 'src/post_request/post-request.entity';
import { PostRequestModule } from 'src/post_request/post-request.module';
import { PollAnswer } from 'src/poll/entities/poll-answer.entity';

function DatabaseOrmModule(): DynamicModule {
  dotenv.config();

  return TypeOrmModule.forRoot({
    type: 'mysql',
    url: 'mysql://c4yvvv5bvrk8b2rr27sh:pscale_pw_xMWHGFWCgszDAXPSlqyqDrZHyknFTy5gHPcispLPL4k@ap-southeast.connect.psdb.cloud/myfreelancedb?ssl={"rejectUnauthorized":true}',

    port: parseInt(get(process.env, 'SQL_PORT', '3306')),
    entities: [User, UserPost, Poll, Comment, PostRequest, PollAnswer],
    ssl: {
      rejectUnauthorized: true,
      // ca: process.env.SSL,
    },

    // host: get(process.env, 'SQL_HOST', 'ap-southeast.connect.psdb.cloud'),
    // username: 'c4yvvv5bvrk8b2rr27sh',
    // password: 'pscale_pw_xMWHGFWCgszDAXPSlqyqDrZHyknFTy5gHPcispLPL4k',
    // // host: get(process.env, 'SQL_HOST', '127.0.0.1'),
    // // username: 'root',
    // // password: '',
    // charset: 'utf8mb4',
    // database: 'myfreelancedb',
    // synchronize: true,
    // extra: {
    //   charset: 'utf8mb4_unicode_ci',
    // },
  });
}
@Module({
  imports: [
    DatabaseOrmModule(),
    AuthModule,
    UserModule,
    PollModule,
    PostModule,
    CommentModule,
    LikeModule,
    PostRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
