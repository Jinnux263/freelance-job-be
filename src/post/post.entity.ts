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

  @ManyToOne((type) => User, (user) => user.createdPosts, {
    onDelete: 'SET NULL',
  })
  owner: User;

  @OneToMany((type) => Comment, (comment) => comment.post)
  comment: Comment[];

  @ManyToMany((type) => User, (user) => user.likedPosts, {
    // onDelete: 'CASCADE',
  })
  @JoinTable()
  likeUser: User[];

  addLikeUser(user: User) {
    if (this.likeUser == null) {
      this.likeUser = new Array<User>();
    }
    this.likeUser.push(user);
  }

  constructor(init: Partial<UserPost>) {
    super();
    return Object.assign(this, init);
  }
}
