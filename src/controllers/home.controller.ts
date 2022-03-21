import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';

@controller(`/`)
export class HomeController extends BaseHttpController {
  @httpGet('')
  public async home(): Promise<string> {
    return 'Hello, i am working!!!';
  }
}
