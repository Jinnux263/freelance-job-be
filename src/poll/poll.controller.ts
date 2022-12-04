import {
  Body,
  Controller,
  Post,
  Request,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { BaseResponse } from 'src/base/base.dto';
import { PollAnswerCreation } from 'src/poll/dto/poll-answer.dto';
import { PollCreation, PollUpdation } from 'src/poll/dto/poll.dto';
import { PollAnswer } from 'src/poll/entities/poll-answer.entity';
import { Poll } from 'src/poll/entities/poll.entity';
import { PollService } from 'src/poll/poll.service';

@ApiTags('Poll Request API')
@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post('')
  createPoll(
    @Request() request: { user: AuthUser },
    @Body() body: PollCreation,
  ): Promise<Poll> {
    return this.pollService.createPoll(request.user, body);
  }

  @Post(':pollID/option')
  createPollOption(
    @Request() request: { user: AuthUser },
    @Param('pollID') pollID: string,
    @Body() body: PollAnswerCreation,
  ): Promise<PollAnswer> {
    return this.pollService.createPollOption(request.user, pollID, body);
  }

  @Delete(':pollId/option/:optionId')
  removePollOption(
    @Request() request: { user: AuthUser },
    @Param('optionId') optionId: string,
    @Param('pollId') pollId: string,
  ) {
    return this.pollService.deletePollOption(request.user, optionId);
  }

  @Get(':id')
  getPoll(
    @Param('id') pollId: string,
    @Request() request: { user: AuthUser },
  ): Promise<any> {
    return this.pollService.getPoll(request.user, pollId);
  }

  @Get('')
  getAllPolls(@Request() request: { user: AuthUser }): Promise<any> {
    return this.pollService.getAllPolls(request.user);
  }

  @Patch(':id')
  updatePoll(
    @Request() request: { user: AuthUser },
    @Param('id') id: string,
    @Body() body: PollUpdation,
  ) {
    return this.pollService.updatePoll(request.user, id, body);
  }

  @Delete(':id')
  removePoll(@Request() request: { user: AuthUser }, @Param('id') id: string) {
    return this.pollService.deletePoll(request.user, id);
  }

  @Post(':pollId/vote/:optionId')
  vote(
    @Request() request: { user: AuthUser },
    @Param('pollId') pollId: string,
    @Param('optionId') optionId: string,
  ): any {
    return this.pollService.vote(request.user, pollId, optionId);
  }

  @Post(':pollId/unvote/:optionId')
  unvote(
    @Request() request: { user: AuthUser },
    @Param('pollId') pollId: string,
    @Param('optionId') optionId: string,
  ): any {
    return this.pollService.unvote(request.user, pollId, optionId);
  }
}
