import { PollAnswerCreation, PollAnswerUpdation } from './dto/poll-answer.dto';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { BaseService } from 'src/base/base.service';
import {
  PollCreation,
  PollRequestDto,
  PollUpdation,
} from 'src/poll/dto/poll.dto';
import { PollAnswer } from 'src/poll/entities/poll-answer.entity';
import { Poll } from 'src/poll/entities/poll.entity';
import { PostService } from 'src/post/post.service';
import { UserService } from 'src/user/user.service';
import { generateUUID, IdPrefix } from 'src/utils';
import { Repository } from 'typeorm';
import { BaseResponse } from 'src/base/base.dto';

@Injectable()
export class PollService extends BaseService<
  Poll,
  PollCreation,
  PollRequestDto
> {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
    @InjectRepository(PollAnswer)
    private readonly pollAnswerRepository: Repository<PollAnswer>,
    private readonly userService: UserService,
    private readonly postRepository: PostService,
  ) {
    super(pollRepository, IdPrefix.POLL);
  }

  // Poll
  async createPoll(
    authUser: AuthUser,
    pollCreation: PollCreation,
  ): Promise<any> {
    return await this.create(pollCreation);
  }

  async getAllPolls(authUser: AuthUser): Promise<any> {
    return await this.findAll();
  }

  async getPoll(authUser: AuthUser, pollId: string): Promise<any> {
    return await this.findSingleBy(
      { id: pollId },
      {
        relations: {
          host: true,
          optionAns: true,
        },
      },
    );
  }

  async updatePoll(
    authUser: AuthUser,
    pollId: string,
    pollUpdatetion: PollUpdation,
  ): Promise<any> {
    return await this.update(pollId, pollUpdatetion);
  }

  async deletePoll(authUser: AuthUser, pollId: string): Promise<BaseResponse> {
    try {
      await this.deleteById(pollId);
      return new BaseResponse(200, 'Delete poll successfully');
    } catch (err) {
      throw new InternalServerErrorException('Internal Error');
    }
  }

  // Poll Answer
  async createPollOption(
    authUser: AuthUser,
    pollId: string,
    pollAnswerCreation: PollAnswerCreation,
  ): Promise<PollAnswer> {
    const poll = await this.findById(pollId);
    pollAnswerCreation['poll'] = poll;

    const data: any = this.pollAnswerRepository.create(
      pollAnswerCreation as any,
    );
    data['createdAt'] = new Date();
    data['updatedAt'] = new Date();
    data['id'] = data.id || generateUUID(IdPrefix.POLL_OPTION);
    await this.pollAnswerRepository.insert(data as any);
    return data as PollAnswer;
  }

  async updatePollOption(
    authUser: AuthUser,
    optionId: string,
    pollAnswerUpdation: PollAnswerUpdation,
  ): Promise<any> {}

  // Todo: Khong can
  async getAllPollOptions(authUser: AuthUser, pollId: string): Promise<any> {
    return await this.pollAnswerRepository.find({
      where: {
        poll: { id: pollId },
      },
      relations: {
        poll: true,
      },
    });
  }

  // Todo: khong can
  async deletePollOption(
    authUser: AuthUser,
    optionId: string,
  ): Promise<BaseResponse> {
    try {
      const pollOption = await this.pollAnswerRepository.findOne({
        where: {
          id: optionId,
        },
        relationLoadStrategy: 'query',
      });
      if (!pollOption) {
        throw new NotFoundException('Can not delete poll option');
      }
      await this.pollAnswerRepository.delete(optionId);
      return new BaseResponse(200, 'Delete successfully');
    } catch (err) {
      throw new InternalServerErrorException('Internal Error');
    }
  }

  // Poll Interaction
  async vote(authUser: AuthUser, optionId: string): Promise<any> {}
}
