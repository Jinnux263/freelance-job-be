import { User } from 'src/user/user.entity';

export enum IdPrefix {
  USER = 'user',
  POST = 'post',
  POST_REQUEST = 'post_request',
  COMMENT = 'comment',
  POLL = 'poll',
  POLL_OPTION = 'poll-option',
}

export function omitUserPassword(user: User): User {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...newUser } = user;
  return newUser as User;
}
