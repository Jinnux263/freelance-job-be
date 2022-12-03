import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { PollAnswer } from 'src/poll/entities/poll-answer.entity';
import { User } from 'src/user/user.entity';

export class PollAnswerRequestDto {
  id?: string = null;

  constructor(init: Partial<PollAnswerRequestDto>) {
    return Object.assign(this, init);
  }
}

export class PollAnswerCreation {
  answerOption: string;

  constructor(init: Partial<PollAnswerCreation>) {
    return Object.assign(this, init);
  }
}

export class PollAnswerUpdation extends PollAnswerCreation {}
