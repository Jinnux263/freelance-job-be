import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
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
    cascade: true,
  })
  owner: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comment: Comment[];

  @ManyToMany((type) => User, (user) => user.likedPosts, {
    cascade: true,
  })
  @JoinTable()
  likeUser: User[];

  addLikeUser(user: User) {
    if (this.likeUser == null) {
      this.likeUser = new Array<User>();
    }
    this.likeUser.push(user);
  }

  addComment(comment: Comment) {
    if (this.comment == null) {
      this.comment = new Array<Comment>();
    }
    this.comment.push(comment);
  }

  constructor(init: Partial<UserPost>) {
    super();
    return Object.assign(this, init);
  }
}
