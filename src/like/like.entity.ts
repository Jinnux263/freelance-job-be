import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { UserPost } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Like extends BaseEntityClass {
  @ApiProperty({
    description: 'Like ID',
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
    description: 'User',
    type: User,
  })
  @Column('text', { nullable: true })
  user: User;
}
