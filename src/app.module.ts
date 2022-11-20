import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PollModule } from './poll/poll.module';
import { PostModule } from './post/post.module';

@Module({
  // imports: [AuthModule, PollModule, PostModule],
  imports: [AuthModule, UserModule, PollModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
