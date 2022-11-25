import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { UserPost } from 'src/post/post.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Comment extends BaseEntityClass {
  @ApiProperty({
    description: 'Comment ID',
    type: String,
  })
  @PrimaryColumn('varchar', { length: 41 })
  id: string;

  @ApiProperty({
    description: 'Comment',
    type: String,
  })
  @PrimaryColumn('varchar')
  comment: string;

  @ApiProperty({
    description: 'Post',
    type: UserPost,
  })
  @ManyToOne((type) => UserPost, (post) => post.comment, {
    cascade: true,
  })
  post: UserPost;

  // @ApiProperty({
  //   description: "Comment's Reply To",
  //   type: Comment,
  // })
  // @ManyToOne((type) => Comment, (comment) => comment.replyComment)
  // replyToComment: Comment[];

  // @ApiProperty({
  //   description: "Comment's Reply",
  //   type: Comment,
  // })
  // @OneToMany((type) => Comment, (comment) => comment.replyToComment)
  // replyComment: Comment[];
}
