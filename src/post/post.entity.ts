import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { Comment } from 'src/comment/comment.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

export enum PostType {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity()
export class UserPost extends BaseEntityClass {
  @ApiProperty({
    description: 'Post ID',
    type: String,
  })
  @PrimaryColumn('varchar', { length: 41 })
  id: string;

  @ApiProperty({
    description: 'Caption',
    type: String,
  })
  @Column('varchar')
  caption: string;

  @ApiProperty({
    description: 'Post picture',
    type: String,
  })
  @Column('text', { nullable: true })
  postpicture: string;

  @ApiProperty({
    description: 'Post picture',
    enum: PostType,
  })
  @Column('text')
  type: PostType;

  @ManyToOne((type) => User, (user) => user.createdPosts, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @OneToMany((type) => Comment, (comment) => comment.post, {
    onDelete: 'CASCADE',
  })
  comment: Comment[];

  @ManyToMany((type) => User, (user) => user.likedPosts, {
    onDelete: 'CASCADE',
  })
  likeUser: UserPost[];

  constructor(init: Partial<UserPost>) {
    super();
    return Object.assign(this, init);
  }
}
