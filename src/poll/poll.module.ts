import { Poll } from './poll.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';

@Module({
  imports: [TypeOrmModule.forFeature([Poll])],
  controllers: [PollController],
  providers: [PollService],
})
export class PollModule {}
