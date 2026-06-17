import { connect, clearDatabase, closeDatabase } from '@/test/dbHandler';
import User from '@/models/User.model';
import userFactory from '@/test/factory/UserFactory';

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Test User model', () => {
  it('Should create valid user and hash password', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    expect(user.email).toBe(userData.email);
    expect(await user.comparePassword(userData.password)).toBe(true);
  });
  it('Should fail when email format is not valid', async () => {
    const userData = userFactory();
    await expect(
      User.create({ ...userData, email: 'invalid' }),
    ).rejects.toThrow(/Please provide valid email/);
  });

  it('Should rejects when email is already used', async () => {
    const userData = userFactory();

    await User.create(userData);

    await expect(User.create(userData)).rejects.toMatchObject({ code: 11000 });
  });
  it('Should return false if provided password is wrong', async () => {
    const userData = userFactory();

    const user = await User.create(userData);

    expect(await user.comparePassword('incorrect')).toBe(false);
  });
});
