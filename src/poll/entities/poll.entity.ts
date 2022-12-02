import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { PollAnser } from 'src/poll/entities/poll-answer.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';

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

  @ManyToOne((type) => User)
  host: User;

  @OneToMany((type) => PollAnser, (pollQuestion) => pollQuestion.poll)
  optionAns: PollAnser[];
}
