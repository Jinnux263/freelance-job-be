import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  constructor(init: Partial<UpdateCommentDto>) {
    super();
    return Object.assign(this, init);
  }
}
