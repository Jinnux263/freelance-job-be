import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PollRequestDto {
  id?: string = null;

  constructor(init: Partial<PollRequestDto>) {
    return Object.assign(this, init);
  }
}

export class PollCreation {
  @ApiProperty({
    description: 'Full Name of User',
    type: String,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Username',
    type: String,
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Initial password',
    type: String,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User Email',
    type: String,
    required: false,
  })
  @IsEmail()
  @IsOptional()
  mail: string;

  @ApiProperty({
    description: 'User Organization',
    type: String,
    required: false,
  })
  @IsOptional()
  organization: string;

  constructor(init: Partial<PollCreation>) {
    return Object.assign(this, init);
  }
}

export class PollUpdation extends PollCreation {}
