import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { Comment } from 'src/comment/comment.entity';
import { Like } from 'src/like/like.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';

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

  @ManyToOne((type) => User, (user) => user.createdPosts)
  owner: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comment: Comment[];

  @ManyToMany((type) => User, (user) => user.likedPosts)
  likeUser: UserPost[];
}
