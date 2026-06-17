import User from '@/models/User.model';
import RefreshToken from '@/models/RefreshToken.model';
import { connect, clearDatabase, closeDatabase } from '@/test/dbHandler';
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

describe('Test refresh token', () => {
  it('Should create a hash refresh token', async () => {
    const userData = userFactory();
    const user = await User.create(userData);
    const rawToken = 'random-refresh-token';

    const refreshToken = await RefreshToken.create({
      userId: user._id,
      tokenHash: rawToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    expect(refreshToken.tokenHash).toBeDefined();
    expect(refreshToken.tokenHash).not.toBe(rawToken);
    expect(refreshToken.userId.toString()).toBe(user._id.toString());
  });

  it('Should create multiple refresh token belongs to a user', async () => {
    const userData = userFactory();
    const user = await User.create(userData);

    await RefreshToken.create({
      userId: user._id,
      tokenHash: 'rawToken-1',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    await RefreshToken.create({
      userId: user._id,
      tokenHash: 'rawToken-2',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });

    const tokens = await RefreshToken.find({ userId: user._id });

    expect(tokens).toHaveLength(2);
  });

  it('Should fail when the user id is not provided', async () => {
    expect(
      RefreshToken.create({
        tokenHash: 'rawToken-1',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      }),
    ).rejects.toThrow(/Please provide user id/);
  });

  it('Should fail when refresh is not provided', async () => {
    const userData = userFactory();
    const user = await User.create(userData);

    await RefreshToken.create({
      userId: user._id,
      tokenHash: 'rawToken-1',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    });
    await expect(
      RefreshToken.create({
        userId: user._id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      }),
    ).rejects.toThrow(/Please provide a refresh token/);
  });
  it('Should fail when expiresAt is not provided', async () => {
    const userData = userFactory();
    const user = await User.create(userData);

    await expect(
      RefreshToken.create({
        userId: user._id,
        tokenHash: 'refresh-token',
      }),
    ).rejects.toThrow(/Please provide the expired token date/);
  });
});
