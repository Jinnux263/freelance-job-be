import { Poll } from 'src/poll/entities/poll.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class PollAnser {
  @ManyToOne((type) => Poll, (pollAns) => pollAns.optionAns)
  poll: Poll;
}
