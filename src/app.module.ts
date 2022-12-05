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
import { ContactModule } from './contact/contact.module';
import { Contact } from 'src/contact/entities/contact.entity';

function DatabaseOrmModule(): DynamicModule {
  dotenv.config();

  return TypeOrmModule.forRoot({
    type: 'mysql',
    port: parseInt(get(process.env, 'SQL_PORT', '3306')),
    entities: [User, UserPost, Poll, Comment, PostRequest, PollAnswer, Contact],

    url: 'mysql://f5mi33nbvpd2znp5xs2b:pscale_pw_1bD2mxJbEUH6ruTa0KsrbuBSaX2cJPvhhmBcLJqMmQn@ap-southeast.connect.psdb.cloud/myfreelancedb?ssl={"rejectUnauthorized":true}',
    // ssl: {
    //   rejectUnauthorized: true,
    //   ca: process.env.SSL,
    // },

    // host: get(process.env, 'SQL_HOST', 'ap-southeast.connect.psdb.cloud'),
    // username: 'f5mi33nbvpd2znp5xs2b',
    // password: 'pscale_pw_1bD2mxJbEUH6ruTa0KsrbuBSaX2cJPvhhmBcLJqMmQn',
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
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
