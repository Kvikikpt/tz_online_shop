import { IUserEntity } from '../../../entities';

export const UserFixture: Readonly<IUserEntity> = Object.freeze({
  id: 1,
  name: 'asd',
  password: 'password',
  isAdmin: false,
  createdAt: new Date(12312312312),
});
