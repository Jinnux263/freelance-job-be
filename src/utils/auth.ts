import { get } from 'lodash';

export const JWT_SALT = get(
  process.env,
  'JWT_SALT',
  '$2y$12$qA/H5yOUolkiO.9U6V0GluIcpJJTD0gmP3.yDH56btjQ6291XhXqC',
);

export const ADMIN_SECRET = get(process.env, 'ADMIN_SECRET', 'Y!-rq;7GxjTW');
