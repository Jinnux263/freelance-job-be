import { Poll } from './entities/poll.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';
import { UserModule } from 'src/user/user.module';
import { PollAnswer } from 'src/poll/entities/poll-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollAnswer]), UserModule],
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}
