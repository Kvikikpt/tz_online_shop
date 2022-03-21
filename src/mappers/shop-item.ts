import { IShopItemEntity } from '../entities';
import { ShopItemResponse } from '../responses';
import { Cached } from '../types';

export const mapShopItem = (shopItem: Cached<IShopItemEntity>): ShopItemResponse => {
  return {
    id: shopItem.id,
    name: shopItem.name,
    price: shopItem.price,
    weight: shopItem.weight,
    startDate: new Date(shopItem.startDate),
    endDate: new Date(shopItem.endDate),
  };
};
