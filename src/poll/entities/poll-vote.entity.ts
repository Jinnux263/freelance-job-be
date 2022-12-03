// Todo: Thay vi lien ket bang Many to many thi tao han bang cho quan he tay ba nay luon
import { ApiProperty } from '@nestjs/swagger';
import { BaseEntityClass } from 'src/base/base.entity';
import { Poll } from 'src/poll/entities/poll.entity';
import { SAMPLE_DATE } from 'src/utils';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class PollVote extends BaseEntityClass {
  @Column('text')
  answerId: string;

  @Column('text')
  pollId: string;

  @Column('text')
  userId: string;

  @ApiProperty({
    type: Date,
    example: SAMPLE_DATE,
  })
  @Column('timestamp')
  createdAt: Date;

  @ApiProperty({
    type: Date,
    example: SAMPLE_DATE,
  })
  @Column('timestamp')
  updatedAt: Date;
}
