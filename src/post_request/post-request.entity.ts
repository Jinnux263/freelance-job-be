import { BaseEntityClass } from 'src/base/base.entity';
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

export enum APPROVE_STATUS {
  APPROVED = 'approved',
  PENDDING = 'pendding',
  REJECTED = 'rejected',
}
@Entity()
export class PostRequest extends BaseEntityClass {
  @PrimaryColumn('varchar', { length: 41 })
  id: string;

  @Column('varchar')
  title: string;

  @Column('text')
  content: string;

  @Column('varchar', { nullable: true })
  postpicture: string;

  @Column('varchar')
  type: PostType;

  @Column('text')
  hashtag: string;

  @Column({
    type: 'bool',
    default: false,
  })
  isApproved: boolean;

  @ManyToOne((type) => User, (user) => user.createdPostRequest, {
    cascade: true,
    eager: true,
  })
  owner: User;

  constructor(init: Partial<PostRequest>) {
    super();
    return Object.assign(this, init);
  }
}
