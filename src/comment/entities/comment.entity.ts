import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { UserPost } from 'src/post/post.entity';
import { Entity, Column, PrimaryColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Comment extends BaseEntityClass {
  @PrimaryColumn('varchar', { length: 41 })
  id: string;

  @Column('varchar')
  comment: string;

  @ManyToOne((type) => UserPost, (post) => post.comment, {
    cascade: true,
  })
  post: UserPost;

  @ManyToOne((type) => Comment, (comment) => comment.replyComment)
  replyToComment: Comment;

  @OneToMany((type) => Comment, (comment) => comment.replyToComment)
  replyComment: Comment[];

  constructor(init: Partial<Comment>) {
    super();
    return Object.assign(this, init);
  }
}
