import { provideSingleton } from '../ioc/decorators';
import { JWT_KEY, TYPES } from '../constants';
import { sign, verify } from 'jsonwebtoken';
import { inject } from 'inversify';
import { UserRepository } from '../repositories';
import { IUserEntity } from '../entities';
import { HttpError } from '../errors';
import { HttpStatusCode } from '../types';
import { Logger } from 'winston';
import { LoggerFactory } from '../logger';
import * as crypto from 'crypto';

@provideSingleton(TYPES.AuthService)
export class AuthService {
  private logger: Logger;

  constructor() {
    this.logger = LoggerFactory.getLogger('AUTH_SERVICE');
  }

  @inject(TYPES.UserRepository)
  private readonly userRepository!: UserRepository;

  private static generateUserToken(user: IUserEntity): string {
    return sign({ user }, JWT_KEY, {
      expiresIn: 60 * 5, // 5 min
    });
  }

  private static encryptUserPassword(password: string): string {
    return crypto
      .pbkdf2Sync(password, process.env.SALT ?? 'salt', 666, 10, 'sha512')
      .toString('hex');
  }

  async createUserAndGetToken(user: Pick<IUserEntity, 'password' | 'name' | 'isAdmin'>) {
    const createdUser = await this.userRepository.createNewUser({
      ...user,
      password: AuthService.encryptUserPassword(user.password),
    });
    this.logger.info('Created new user', {
      username: user.name,
    });
    return AuthService.generateUserToken(createdUser);
  }

  async getTokenByPassportAndName(password: string, name: string) {
    const foundUser = await this.userRepository.getUserByPasswordAndUsername({
      password: AuthService.encryptUserPassword(password),
      name,
    });

    if (!foundUser) {
      this.logger.error('User not found', {
        username: name,
      });
      throw new HttpError('User is not found', HttpStatusCode.NotFound);
    }

    return AuthService.generateUserToken(foundUser);
  }

  async getUserByToken(token: string): Promise<IUserEntity> {
    return new Promise((resolve, reject) => {
      verify(token, JWT_KEY, (err, decoded) => {
        if (err) {
          this.logger.error('Token verification fails');
          return reject(err);
        }
        if (!decoded || typeof decoded !== 'object' || !decoded.user) {
          this.logger.error(
            'Token verification fails, invalid object parsed from token',
            {
              decoded,
            }
          );
          return reject(err);
        }
        resolve(decoded.user as IUserEntity);
      });
    });
  }
}
