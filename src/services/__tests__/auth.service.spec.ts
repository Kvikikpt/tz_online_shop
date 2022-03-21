import { AuthService } from '../auth.service';
import { container } from '../../ioc/containter';
import { UserFixture } from './__fixtures__';
import { HttpError } from '../../errors';
import { HttpStatusCode } from '../../types';

jest.useFakeTimers('modern');

describe('AuthService', () => {
  let service: AuthService;

  jest.setSystemTime(new Date(12312312312));
  beforeEach(() => {
    service = container.resolve<AuthService>(AuthService);
  });

  describe('generateUserToken', () => {
    it('successfully generates user token', () => {
      expect(
        // @ts-ignore
        typeof AuthService.generateUserToken(UserFixture) === 'string'
      ).toBeTruthy();
    });
  });

  describe('encryptUserPassword', () => {
    it('successfully encrypts user password', () => {
      process.env.SALT = 'test_salt';
      expect(
        // @ts-ignore
        AuthService.encryptUserPassword('somepassword')
      ).toMatchSnapshot();
    });
  });

  describe('createUserAndGetToken', () => {
    let createNewUser: jest.SpyInstance;

    beforeEach(() => {
      createNewUser = jest
        //@ts-ignore
        .spyOn(service.userRepository, 'createNewUser')
        .mockResolvedValueOnce(UserFixture);
    });

    it('creating a new user', async () => {
      //@ts-ignore
      AuthService.generateUserToken = jest
        //@ts-ignore
        .fn(AuthService.generateUserToken)
        .mockImplementationOnce(() => 'test_token_lul');
      expect(await service.createUserAndGetToken(UserFixture)).toEqual('test_token_lul');
      expect(createNewUser).toBeCalled();
      //@ts-ignore
      expect(AuthService.generateUserToken).toBeCalled();
    });
  });

  describe('getTokenByPassportAndName', () => {
    let getUserByPasswordAndUsername: jest.SpyInstance;

    beforeEach(() => {
      getUserByPasswordAndUsername = jest
        //@ts-ignore
        .spyOn(service.userRepository, 'getUserByPasswordAndUsername');
    });

    it('gets token by passport and name', async () => {
      getUserByPasswordAndUsername.mockResolvedValueOnce(UserFixture);
      //@ts-ignore
      AuthService.generateUserToken = jest
        //@ts-ignore
        .fn(AuthService.generateUserToken)
        .mockImplementationOnce(() => 'test_token_lul');
      expect(await service.getTokenByPassportAndName('somepass', 'somename')).toEqual(
        'test_token_lul'
      );
      expect(getUserByPasswordAndUsername).toBeCalled();
    });

    it('if user not found, throws error', async () => {
      getUserByPasswordAndUsername.mockResolvedValueOnce(undefined);
      await expect(
        service.getTokenByPassportAndName('somepass', 'somename')
      ).rejects.toThrowError(new HttpError('User is not found', HttpStatusCode.NotFound));
      expect(getUserByPasswordAndUsername).toBeCalled();
    });
  });

  describe('getUserByToken', () => {
    it('gets user from token successfully', async () => {
      expect(
        // @ts-ignore
        await service.getUserByToken(AuthService.generateUserToken(UserFixture))
      ).toMatchSnapshot();
    });

    it('throws error, if token is invalid', async () => {
      await expect(service.getUserByToken('some_swong_token')).rejects.toThrowError();
    });
  });
});
