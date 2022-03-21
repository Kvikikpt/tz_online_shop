import { provideSingleton } from '../ioc/decorators';
import { BaseRepository } from './base.repository';
import { EntityRepository, InsertResult, ObjectType } from 'typeorm';
import { TYPES } from '../constants';
import { IShopItemEntity, ShopItemEntity } from '../entities';

@provideSingleton(TYPES.ShopItemRepository)
@EntityRepository(ShopItemEntity)
export class ShopItemRepository extends BaseRepository<ShopItemEntity> {
  protected getEntity(): ObjectType<ShopItemEntity> {
    return ShopItemEntity;
  }

  public async createNewShopItem(
    item: Omit<IShopItemEntity, 'id'>
  ): Promise<IShopItemEntity> {
    return this.getRepository().save(item);
  }

  public async createManyShopItems(
    items: Array<Omit<IShopItemEntity, 'id'>>
  ): Promise<InsertResult> {
    return this.getRepository()
      .createQueryBuilder()
      .insert()
      .into(ShopItemEntity)
      .values(items)
      .execute();
  }

  public async getActiveAllShopItems(): Promise<IShopItemEntity[]> {
    return this.getRepository().find({
      where: 'end_date >= now()',
    });
  }
}
