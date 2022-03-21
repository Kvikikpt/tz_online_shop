import {
  BaseHttpController,
  controller,
  httpPost,
  requestBody,
} from 'inversify-express-utils';
import { AUTH_PREFIX, TYPES } from '../constants';
import { userValidator } from '../validators';
import { inject } from 'inversify';
import { AuthService } from '../services';
import { TokenResponse } from '../responses';

@controller(`${AUTH_PREFIX}`)
export class AuthController extends BaseHttpController {
  @inject(TYPES.AuthService)
  private readonly authService!: AuthService;

  @httpPost('/')
  public async auth(@requestBody() body: unknown): Promise<TokenResponse> {
    const { name, password } = await userValidator.validate(body);

    return { token: await this.authService.getTokenByPassportAndName(name, password) };
  }

  @httpPost('/create_user')
  public async createUser(@requestBody() body: unknown): Promise<TokenResponse> {
    const { name, password } = await userValidator.validate(body);

    return {
      token: await this.authService.createUserAndGetToken({
        name,
        password,
        isAdmin: false,
      }),
    };
  }
}
