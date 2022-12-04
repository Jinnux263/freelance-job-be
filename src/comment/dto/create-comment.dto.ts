import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment value',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  comment: string;

  constructor(init: Partial<CreateCommentDto>) {
    return Object.assign(this, init);
  }
}
