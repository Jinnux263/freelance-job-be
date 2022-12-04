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
    const user = await this.userService.findSingleBy({ id: authUser.id });
    pollCreation['host'] = user;
    return await this.create(pollCreation);
  }

  async getAllPolls(authUser: AuthUser): Promise<any> {
    return await this.findAll();
  }

  async getPoll(authUser: AuthUser, pollId: string): Promise<any> {
    const poll = await this.findSingleBy(
      { id: pollId },
      {
        relations: {
          host: true,
          optionAns: true,
        },
      },
    );

    if (!poll) {
      throw new NotFoundException('There is no poll');
    }

    return poll;
  }

  async updatePoll(
    authUser: AuthUser,
    pollId: string,
    pollUpdatetion: PollUpdation,
  ): Promise<any> {
    const checkValid = await this.pollRepository.find({
      where: {
        id: pollId,
        host: {
          id: authUser.id,
        },
      },
      relations: {
        host: true,
      },
    });

    if (checkValid.length === 0) {
      throw new InternalServerErrorException('You can not do this task');
    }

    return await this.update(pollId, pollUpdatetion);
  }

  async deletePoll(authUser: AuthUser, pollId: string): Promise<BaseResponse> {
    const checkValid = await this.pollRepository.find({
      where: {
        id: pollId,
        host: {
          id: authUser.id,
        },
      },
      relations: {
        host: true,
      },
    });

    if (checkValid.length === 0) {
      throw new InternalServerErrorException('You can not do this task');
    }

    try {
      await this.deleteById(pollId);
      return new BaseResponse(200, 'Delete poll successfully');
    } catch (err) {
      console.log(err.message);

      throw new InternalServerErrorException('Internal Error');
    }
  }

  // Poll Answer
  async createPollOption(
    authUser: AuthUser,
    pollId: string,
    pollAnswerCreation: PollAnswerCreation,
  ): Promise<PollAnswer> {
    try {
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
    } catch (err) {
      throw new InternalServerErrorException('Internal Error');
    }
  }

  // // Todo: Khong can
  // async updatePollOption(
  //   authUser: AuthUser,
  //   optionId: string,
  //   pollAnswerUpdation: PollAnswerUpdation,
  // ): Promise<any> {
  //   try {
  //     const pollAnswer = await this.pollAnswerRepository.findOne({
  //       where: {
  //         id: optionId,
  //       },
  //       relationLoadStrategy: 'query',
  //     });
  //     if (!pollAnswer) {
  //       throw new NotFoundException('There is no option');
  //     }

  //     await this.pollAnswerRepository.update(optionId, {
  //       answerOption: pollAnswerUpdation.answerOption,
  //     });
  //     return pollAnswer;
  //   } catch (err) {
  //     throw new InternalServerErrorException('Interal Error');
  //   }
  // }

  // // Todo: Khong can
  // async getAllPollOptions(authUser: AuthUser, pollId: string): Promise<any> {
  //   return await this.pollAnswerRepository.find({
  //     where: {
  //       poll: { id: pollId },
  //     },
  //     relations: {
  //       poll: true,
  //     },
  //   });
  // }

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
  // Todo: Khong cap nhat khi thuc hien lenh save
  async vote(
    authUser: AuthUser,
    pollId: string,
    optionId: string,
  ): Promise<any> {
    const user = await this.userService.findSingleBy({ id: authUser.id });
    const pollOption = await this.pollAnswerRepository.findOne({
      where: {
        id: optionId,
        votedUser: { id: authUser.id },
      },
      relations: {
        votedUser: true,
      },
    });
    if (pollOption) {
      return pollOption;
      // throw new NotFoundException('There is no poll option');
    }

    const votePollOption = await this.pollAnswerRepository.findOne({
      where: {
        id: optionId,
      },
      relations: {
        votedUser: true,
      },
    });
    if (!votePollOption) {
      throw new NotFoundException('There is no poll option');
    }
    // console.log(votePollOption);

    votePollOption.votedUser.push(user);
    return await this.pollAnswerRepository.save(votePollOption);
  }

  // Todo: Khong cap nhat khi thuc hien lenh save
  async unvote(
    authUser: AuthUser,
    pollId: string,
    optionId: string,
  ): Promise<any> {
    // const poll = await this.findSingleBy(
    //   {
    //     id: pollId,
    //     optionAns: { id: optionId },
    //   },
    //   {
    //     relations: {
    //       optionAns: {
    //         votedUser: true,
    //       },
    //     },
    //   },
    // );
    // if (!poll) {
    //   throw new NotFoundException('There is no poll or poll option');
    // }

    // poll.optionAns.map((option) => {
    //   if (option.id == optionId) {
    //     option.votedUser = option.votedUser.filter(
    //       (user) => user.id != authUser.id,
    //     );
    //   }
    // });
    // console.log(poll);

    // return await this.pollRepository.save(poll);

    const pollOption = await this.pollAnswerRepository.findOne({
      where: {
        id: optionId,
        votedUser: { id: authUser.id },
      },
      relations: {
        votedUser: true,
      },
    });
    if (!pollOption) {
      // return pollOption;
      throw new NotFoundException('You have not voted this option yet');
    }

    const votePollOption = await this.pollAnswerRepository.findOne({
      where: {
        id: optionId,
      },
      relations: {
        votedUser: true,
      },
    });

    votePollOption.votedUser = votePollOption.votedUser.filter(
      (user) => user.id != authUser.id,
    );

    return await this.pollAnswerRepository.save(votePollOption);
  }
}
