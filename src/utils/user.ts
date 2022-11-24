import { User } from 'src/user/user.entity';

export enum IdPrefix {
  USER = 'user',
  POST = 'post',
  COMMENT = 'comment',
  POLL = 'poll',
}

export function omitUserPassword(user: User): User {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...newUser } = user;
  return newUser as User;
}
