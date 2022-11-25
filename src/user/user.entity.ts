import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { UserPost } from 'src/post/post.entity';
import { SAMPLE_DATE, SAMPLE_USER_ID } from 'src/utils';
import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export enum DataType {
  ENVIRONMENT = 'ENVIRONMENT',
  EDUCATION = 'EDUCATION',
  MEDICAL = 'MEDICAL',
  TRAFFIC = 'TRAFFIC',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User extends BaseEntityClass {
  @ApiProperty({
    description: 'User ID',
    type: String,
    example: SAMPLE_USER_ID,
  })
  @PrimaryColumn('varchar', { length: 41 })
  id: string;

  @ApiProperty({
    description: 'User Avatar',
    type: String,
    example: null,
  })
  @Column('text', { nullable: true })
  avatar: string;

  @ApiProperty({
    description: 'Username',
    type: String,
    example: 'johndoe',
  })
  @Column('varchar', { length: 32, unique: true })
  username: string;

  @Column('text', { select: false })
  password: string;

  @ApiProperty({
    description: 'User Full Name',
    type: String,
    example: 'John Doe',
  })
  @Column('text')
  name: string;

  @ApiProperty({
    description: 'User Role',
    enum: UserRole,
    example: UserRole.USER,
  })
  @Column('text')
  role: UserRole;

  @ApiProperty({
    description: 'User Email',
    type: String,
    example: 'abc@gmail.com',
  })
  @Column('varchar', { nullable: true })
  email: string;

  @ApiProperty({
    description: 'User Organization',
    type: String,
    example: 'CSE, Ho Chi Minh city University of Technology',
  })
  @Column('text', { nullable: true })
  organization: string;

  @OneToMany((type) => UserPost, (post) => post.owner)
  createdPosts: UserPost[];

  @ManyToMany((type) => UserPost, (post) => post.likeUser)
  likedPosts: UserPost[];
}
