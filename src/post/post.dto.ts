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

  username?: string = null;

  constructor(init: Partial<PostRequest>) {
    return Object.assign(this, init);
  }
}

export class PostCreation {
  @ApiProperty({
    description: 'Caption',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  caption: string;

  @ApiProperty({
    description: 'Post picture',
    type: String,
  })
  @IsOptional()
  postpicture: string;

  constructor(init: Partial<PostCreation>) {
    return Object.assign(this, init);
  }
}

export class PostUpdation extends PostCreation {}
