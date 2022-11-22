import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { UserPost } from 'src/post/post.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Comment extends BaseEntityClass {
  @ApiProperty({
    description: 'Comment ID',
    type: String,
  })
  @PrimaryColumn('varchar', { length: 41 })
  id: string;

  @ApiProperty({
    description: 'Post',
    type: UserPost,
  })
  @Column('varchar')
  post: UserPost;

  @ApiProperty({
    description: 'Post',
    type: UserPost,
  })
  @Column('varchar')
  reply: UserPost;
}
