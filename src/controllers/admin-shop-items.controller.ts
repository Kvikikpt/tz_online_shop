import {
  BaseHttpController,
  controller,
  httpPut,
  requestBody,
  response,
} from 'inversify-express-utils';
import { ADMIN_SHOP_ITEMS_PREFIX, TYPES } from '../constants';
import { shopItemValidator } from '../validators';
import { inject } from 'inversify';
import { ShopItemService } from '../services';
import { Response } from 'express';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types';
import { IShopItemEntity } from '../entities';

@controller(`${ADMIN_SHOP_ITEMS_PREFIX}`)
export class AdminShopItemsController extends BaseHttpController {
  @inject(TYPES.ShopItemService)
  private readonly shopItemService!: ShopItemService;

  @httpPut('/create', TYPES.AuthCheckMiddleware, TYPES.AdminCheckMiddleware)
  public async createShopItem(
    @requestBody() body: unknown,
    @response() res: Response
  ): Promise<any> {
    const { name, endDate, price, startDate, weight } = await shopItemValidator.validate(
      body
    );

    await this.shopItemService.createNewShopItem({
      name,
      endDate,
      price,
      startDate,
      weight,
    });

    res.status(204);
  }

  @httpPut('/create_many', TYPES.AuthCheckMiddleware, TYPES.AdminCheckMiddleware)
  public async createManyShopItems(
    @requestBody() body: unknown,
    @response() res: Response
  ): Promise<any> {
    if (!Array.isArray(body)) {
      throw new HttpError('Wrong array of shop items passed', HttpStatusCode.BadRequest);
    }

    const items: Array<Omit<IShopItemEntity, 'id'>> = [];
    for (const item of body) {
      items.push(await shopItemValidator.validate(item));
    }

    await this.shopItemService.createManyNewShopItems(items);

    res.status(204);
  }
}
