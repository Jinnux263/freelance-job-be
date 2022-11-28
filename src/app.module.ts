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
    url: 'mysql://6b4la8697ref8mumodcc:pscale_pw_jOUz3kBM6DeG23PnAgh53v1Nn64WVLeyiLpuVThqwYC@ap-southeast.connect.psdb.cloud/myfreelancedb?ssl={"rejectUnauthorized":true}',

    // host: get(process.env, 'SQL_HOST', 'ap-southeast.connect.psdb.cloud'),
    // charset: 'utf8mb4',
    port: parseInt(get(process.env, 'SQL_PORT', '3306')),
    // // TODO: Change to read from .env file for security
    // username: 'aqfdy2szcniwlh8c04n2',
    // password: 'pscale_pw_W1MBSuBQ0DU09tbsV5fkT3aerM2okI5mZFk5A3324Sj',
    // database: 'myfreelancedb',
    entities: [User, UserPost, Poll, Comment],
    // synchronize: true,
    // extra: {
    //   charset: 'utf8mb4_unicode_ci',
    // },
    // autoLoadEntities: true,
    ssl: {
      rejectUnauthorized: true,
      // ca: '/etc/ssl/certs/ca-certificates.crt',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
