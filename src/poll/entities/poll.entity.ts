import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { PollAnswer } from 'src/poll/entities/poll-answer.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

export enum PollType {
  SINGLE_CHOICE = 'single',
  MULTI_CHOICE = 'multi',
}
@Entity()
export class Poll extends BaseEntityClass {
  @ApiProperty({
    description: 'Poll ID',
    type: String,
  })
  @PrimaryColumn('varchar', { length: 41 })
  id: string;

  @ApiProperty({
    description: 'Poll title - the question',
    type: String,
  })
  @Column('varchar')
  title: string;

  @ApiProperty({
    description: 'Poll description',
    type: String,
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'Poll description',
    enum: PollType,
  })
  @Column('text')
  pollType: PollType;

  @ManyToOne((type) => User, {
    cascade: true,
  })
  host: User;

  @OneToMany((type) => PollAnswer, (pollQuestion) => pollQuestion.poll)
  optionAns: PollAnswer[];

  // @ManyToMany((type) => User, (user) => user.votedPoll, {
  //   cascade: true,
  // })
  // @JoinTable()
  // votedUser: User[];
}
