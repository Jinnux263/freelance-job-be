import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PostRequestDto {
  id?: string = null;

  title?: string = null;

  constructor(init: Partial<PostRequestDto>) {
    return Object.assign(this, init);
  }
}

export class PostRequestCreation {
  @ApiProperty({
    description: 'Title',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Content',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Post picture',
    type: String,
  })
  @IsOptional()
  @IsString()
  postpicture: string;

  constructor(init: Partial<PostRequestCreation>) {
    return Object.assign(this, init);
  }
}

export class PostRequestUpdation extends PostRequestCreation {}
