import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment value',
    type: String,
  })
  comment: string;

  constructor(init: Partial<CreateCommentDto>) {
    return Object.assign(this, init);
  }
}
