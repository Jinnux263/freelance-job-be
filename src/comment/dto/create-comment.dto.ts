export class CreateCommentDto {
  comment: string;

  constructor(init: Partial<CreateCommentDto>) {
    return Object.assign(this, init);
  }
}
