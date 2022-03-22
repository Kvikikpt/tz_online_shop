import { IUserEntity } from '../../../entities';
import crypto from 'crypto';

export const UserFixture: Readonly<IUserEntity> = Object.freeze({
  id: 1,
  name: 'asd',
  password: crypto
    .pbkdf2Sync('somepass', 'somenanoid', 666, 10, 'sha512')
    .toString('hex'),
  isAdmin: false,
  createdAt: new Date(12312312312),
  salt: 'somenanoid',
});
