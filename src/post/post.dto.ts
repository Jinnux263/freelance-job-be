import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class PostRequest {
  id?: string = null;

  title?: string = null;

  constructor(init: Partial<PostRequest>) {
    return Object.assign(this, init);
  }
}

export class PostCreation {
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

  @ApiProperty({
    description: 'Post hashtag',
    type: String,
  })
  @IsOptional()
  hashtag: string[];

  constructor(init: Partial<PostCreation>) {
    return Object.assign(this, init);
  }
}

export class PostUpdation extends PostCreation {}
