import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { Poll } from 'src/poll/entities/poll.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity()
export class PollAnswer extends BaseEntityClass {
  @ApiProperty({
    description: 'Poll Options ID',
    type: String,
  })
  @PrimaryColumn('varchar', { length: 41 })
  id: string;

  @Column('text')
  answerOption: string;

  @ManyToOne((type) => Poll, (pollAns) => pollAns.optionAns, {
    onDelete: 'CASCADE',
  })
  poll: Poll;

  @ManyToMany((type) => User, (user) => user.votedPollAnswer, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable()
  votedUser: User[];
}
