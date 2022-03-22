import * as crypto from 'crypto';
export { TYPES } from './types';

export const SHOP_ITEMS_ROUTE_NAME = 'shop_items';
export const GLOBAL_PREFIX = '/api';
export const AUTH_PREFIX = `${GLOBAL_PREFIX}/auth`;
export const ADMIN_PREFIX = `${GLOBAL_PREFIX}/admin`;
export const SHOP_ITEMS_PREFIX = `${GLOBAL_PREFIX}/${SHOP_ITEMS_ROUTE_NAME}`;
export const ADMIN_SHOP_ITEMS_PREFIX = `${ADMIN_PREFIX}/${SHOP_ITEMS_ROUTE_NAME}`;

export const JWT_KEY = crypto.randomBytes(100);

export const POSTGRES_INT_MAX_VALUE = 2147483647;
export const POSTGRES_INT_MIN_VALUE = -2147483648;
