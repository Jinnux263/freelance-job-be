import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { UserPost } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
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

  @ManyToOne((type) => Comment, (comment) => comment.replyComment, {
    nullable: true,
  })
  replyToComment: Comment;

  @OneToMany((type) => Comment, (comment) => comment.replyToComment, {
    nullable: true,
    cascade: true,
  })
  replyComment: Comment[];

  @ManyToOne((type) => User, (user) => user.comments, {
    nullable: false,
    cascade: true,
  })
  owner: User;

  constructor(init: Partial<Comment>) {
    super();
    return Object.assign(this, init);
  }
}
