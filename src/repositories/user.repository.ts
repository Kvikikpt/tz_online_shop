import { provideSingleton } from '../ioc/decorators';
import { BaseRepository } from './base.repository';
import { EntityRepository, ObjectType } from 'typeorm';
import { TYPES } from '../constants';
import { IUserEntity, UserEntity } from '../entities';

@provideSingleton(TYPES.UserRepository)
@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
  protected getEntity(): ObjectType<UserEntity> {
    return UserEntity;
  }

  public async createNewUser(
    user: Pick<IUserEntity, 'password' | 'isAdmin' | 'name' | 'salt'>
  ): Promise<IUserEntity> {
    return this.getRepository().save(user);
  }

  public async getUserByPasswordAndUsername(
    filters: Pick<IUserEntity, 'name'>
  ): Promise<IUserEntity | undefined> {
    return this.getRepository().findOne(filters);
  }
}
