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
import { nanoid } from 'nanoid';

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

  private static encryptUserPassword(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 666, 10, 'sha512').toString('hex');
  }

  async createUserAndGetToken(user: Pick<IUserEntity, 'password' | 'name' | 'isAdmin'>) {
    const salt = nanoid();
    const createdUser = await this.userRepository.createNewUser({
      ...user,
      password: AuthService.encryptUserPassword(user.password, salt),
      salt,
    });
    this.logger.info('Created new user', {
      username: user.name,
    });
    return AuthService.generateUserToken(createdUser);
  }

  async getTokenByPassportAndName(password: string, name: string) {
    const foundUser = await this.userRepository.getUserByPasswordAndUsername({
      name,
    });

    if (!foundUser) {
      this.logger.error('User not found', {
        username: name,
      });
      throw new HttpError('Authorisation failed', HttpStatusCode.Forbidden);
    }

    if (
      AuthService.encryptUserPassword(password, foundUser.salt) !== foundUser.password
    ) {
      this.logger.error('User has wrong password', {
        username: name,
      });
      throw new HttpError('Authorisation failed', HttpStatusCode.Forbidden);
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
