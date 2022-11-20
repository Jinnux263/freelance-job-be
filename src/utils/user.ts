import { User } from 'src/user/user.entity';

export enum IdPrefix {
  USER = 'user',
  REQUEST = 'request',
  DATA_SOURCE = 'source',
  DATA_CATEGORY = 'category',
  SCHEMA = 'schema',
}

export function omitUserPassword(user: User): User {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...newUser } = user;
  return newUser as User;
}
