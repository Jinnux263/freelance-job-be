import { createParamDecorator, SetMetadata } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { pick } from 'lodash';
import { JWT_SALT } from 'src/utils';
import { InvalidToken } from './auth.entity';

export const Authorization = createParamDecorator((_, context: any) => {
  const request = context.switchToHttp().getRequest();
  const { authorization: accessToken } = request.headers;

  try {
    const decoded = jwt.verify(accessToken, JWT_SALT);
    return pick(decoded, 'userId');
  } catch (ex) {
    throw new InvalidToken();
  }
});

export interface AuthUser {
  id: string;
}

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
