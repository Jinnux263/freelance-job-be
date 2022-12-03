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

export class PollRequestDto {
  id?: string = null;

  host?: User = null;

  constructor(init: Partial<PollRequestDto>) {
    return Object.assign(this, init);
  }
}

export class PollCreation {
  @ApiProperty({
    description: 'Poll Question',
    type: String,
    example: 'Cac ban muon lam gi hom nay?',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Description for Poll',
    type: String,
    required: false,
    example: 'Co the tao them cac lua chon neu ban thich',
  })
  @IsOptional()
  @IsString()
  description?: string;

  // optionAns?: PollAnswer[];

  constructor(init: Partial<PollCreation>) {
    return Object.assign(this, init);
  }
}

export class PollUpdation extends PollCreation {}
