import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';
import { SHOP_ITEMS_PREFIX, TYPES } from '../constants';
import { inject } from 'inversify';
import { ShopItemService } from '../services';
import { ShopItemResponse } from '../responses';
import { mapShopItem } from '../mappers';

@controller(`${SHOP_ITEMS_PREFIX}`)
export class ShopItemsController extends BaseHttpController {
  @inject(TYPES.ShopItemService)
  private readonly shopItemService!: ShopItemService;

  @httpGet('/get_random_five', TYPES.AuthCheckMiddleware)
  public async getRandomFive(): Promise<ShopItemResponse[]> {
    return (await this.shopItemService.getRandomShopItemsCached(5)).map(mapShopItem);
  }
}
