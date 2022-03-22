import { provideSingleton } from '../ioc/decorators';
import { TYPES } from '../constants';
import { inject } from 'inversify';
import { ShopItemRepository } from '../repositories';
import { IShopItemEntity } from '../entities';
import { Logger } from 'winston';
import { LoggerFactory } from '../logger';
import { Cached } from '../types';
import { CacheManager } from '../managers';
import { RedisKeys } from '../types/redis-keys';

@provideSingleton(TYPES.ShopItemService)
export class ShopItemService {
  private logger: Logger;

  constructor() {
    this.logger = LoggerFactory.getLogger('SHOP_ITEM_SERVICE');
  }

  @inject(TYPES.ShopItemRepository)
  private readonly shopItemRepository!: ShopItemRepository;

  @inject(TYPES.CacheManager)
  private readonly cacheManager!: CacheManager;

  async createNewShopItem(item: Omit<IShopItemEntity, 'id'>): Promise<void> {
    const newShopItem = await this.shopItemRepository.createNewShopItem(item);
    this.logger.info('New shop item was created', {
      newShopItem,
    });
  }

  async createManyNewShopItems(items: Array<Omit<IShopItemEntity, 'id'>>): Promise<void> {
    const result = await this.shopItemRepository.createManyShopItems(items);
    this.logger.info('Inserted multiple items', {
      result,
    });
  }

  private async getAllShopItems(): Promise<IShopItemEntity[]> {
    return this.shopItemRepository.getActiveAllShopItems();
  }

  private async getRandomShopItems(amount: number): Promise<IShopItemEntity[]> {
    const shopItems = await this.getAllShopItems();

    return shopItems
      .map((item) => ({ item, roll: Math.random() * item.weight }))
      .sort((first, second) => second.roll - first.roll)
      .map(({ item }) => item)
      .slice(0, amount)
      .sort((first, second) => first.id - second.id);
  }

  async getRandomShopItemsCached(amount: number): Promise<Cached<IShopItemEntity[]>> {
    const shopItemsCached = await this.cacheManager.process<IShopItemEntity[]>(
      [RedisKeys.RandomFiveShopItems, amount].join('_'),
      30,
      () => this.getRandomShopItems(amount)
    );

    if (!shopItemsCached) {
      return [];
    }

    return shopItemsCached;
  }
}
