import { UserPost } from './post/post.entity';
import { Poll } from './poll/poll.entity';
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

function DatabaseOrmModule(): DynamicModule {
  dotenv.config();

  return TypeOrmModule.forRoot({
    type: 'mysql',
    url: 'mysql://ilvr5rnoumn85ck8fpn2:pscale_pw_lKWtSqa95mh8yCT11BSG9LVSIhXX2d3kNBMXnBIEM4k@ap-southeast.connect.psdb.cloud/myfreelancedb?ssl={"rejectUnauthorized":true}',

    port: parseInt(get(process.env, 'SQL_PORT', '3306')),
    entities: [User, UserPost, Poll, Comment],
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.SSL_CERT,
    },

    // host: get(process.env, 'SQL_HOST', '127.0.0.1'),
    // host: get(process.env, 'SQL_HOST', 'ap-southeast.connect.psdb.cloud'),
    // charset: 'utf8mb4',
    // username: 'nupt2a4zbdu2smzq2595',
    // password: 'pscale_pw_eINz2vaQwGE9itQ1uTpNRIYM9C0SqXavX3XWNXS1Prt',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
