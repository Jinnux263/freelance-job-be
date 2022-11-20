import { v4 as uuidv4 } from 'uuid';

export const generateUUID = (prefix: string) =>
  `${prefix}_${uuidv4().toString()}`;
