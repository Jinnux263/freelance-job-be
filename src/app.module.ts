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

function DatabaseOrmModule(): DynamicModule {
  dotenv.config();

  return TypeOrmModule.forRoot({
    type: 'mysql',
    // url: 'mysql://0rqorqntl9ardof2ixpc:pscale_pw_Q8xpDJbnUjrLfb0kUY2UBiIGNKIvQLmuVMsdY5IZHxU@ap-southeast.connect.psdb.cloud/myfreelancedb?ssl={"rejectUnauthorized":true}',

    port: parseInt(get(process.env, 'SQL_PORT', '3306')),
    entities: [User, UserPost, Poll, Comment, PostRequest],
    // ssl: {
    //   rejectUnauthorized: true,
    //   // ca: process.env.SSL,
    // },

    host: get(process.env, 'SQL_HOST', '127.0.0.1'),
    // host: get(process.env, 'SQL_HOST', 'ap-southeast.connect.psdb.cloud'),
    charset: 'utf8mb4',
    // username: '0rqorqntl9ardof2ixpc',
    // password: 'pscale_pw_Q8xpDJbnUjrLfb0kUY2UBiIGNKIvQLmuVMsdY5IZHxU',
    username: 'root',
    password: '',
    database: 'myfreelancedb',
    synchronize: true,
    extra: {
      charset: 'utf8mb4_unicode_ci',
    },
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
