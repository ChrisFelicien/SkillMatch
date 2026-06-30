import { connect, clearDatabase, closeDatabase } from '@/test/dbHandler';
import userFactory from '@/test/factory/UserFactory';
import AuthService from '@/services/Auth.service';
import User from '@/models/User.model';

const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+$/;

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Test auth service', () => {
  it('Should create a valid user', async () => {
    const userData = userFactory();
    const result = await AuthService.register(userData);

    expect(result.user).toBeDefined();
    expect(result.accessToken).toMatch(jwtRegex);
    expect(result.refreshToken).toMatch(jwtRegex);
  });

  it('Should login a user', async () => {
    const userData = userFactory();
    await User.create(userData);

    const result = await AuthService.login({
      email: userData.email,
      password: userData.password,
    });

    expect(result.user).toBeDefined();
    expect(result.accessToken).toMatch(jwtRegex);
    expect(result.refreshToken).toMatch(jwtRegex);
  });
});
