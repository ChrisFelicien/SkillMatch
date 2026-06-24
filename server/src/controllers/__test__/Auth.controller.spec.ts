import app from '@/app';
import request from 'supertest';
import userFactory from '@/test/factory/UserFactory';
import { connect, closeDatabase, clearDatabase } from '@/test/dbHandler';
import User from '@/models/User.model';

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Test auth controller', () => {
  it('Should create valid user', async () => {
    const userData = userFactory();
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.statusCode).toBe(201);
    expect(response.headers['set-cookie']).toBeDefined();
    expect(response.body.message).toBe('Account created');
  });

  it('Should successfully login user', async () => {
    const userData = userFactory();
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        ...userData,
        confirmPassword: userData.password,
      });

    const result = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: userData.email, password: userData.password });

    expect(result.statusCode).toBe(200);
    expect(result.headers['set-cookie']).toBeDefined();
  });
});
