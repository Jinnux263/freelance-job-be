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

function DatabaseOrmModule(): DynamicModule {
  dotenv.config();

  return TypeOrmModule.forRoot({
    type: 'mysql',
    host: get(process.env, 'SQL_HOST', '127.0.0.1'),
    charset: 'utf8mb4',
    port: parseInt(get(process.env, 'SQL_PORT', '3306')),
    // TODO: Change to read from .env file for security
    username: 'root',
    password: '',
    database: 'myfreelancedb',
    entities: [User],
    synchronize: true,
    extra: {
      charset: 'utf8mb4_unicode_ci',
    },
  });
}
@Module({
  // imports: [DatabaseOrmModule(), UserModule, PollModule, PostModule],
  imports: [
    DatabaseOrmModule(),
    AuthModule,
    UserModule,
    PollModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
