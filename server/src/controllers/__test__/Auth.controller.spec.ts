import app from '@/app';
import request from 'supertest';
import userFactory from '@/test/factory/UserFactory';
import { connect, closeDatabase, clearDatabase } from '@/test/dbHandler';

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
    expect(response);
  });

  it('Should fail to register user when the email is already used', async () => {
    const userData = userFactory();
    await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.status).toBe(409);
    expect(response.body.message).toBe(
      `email already exists. Please use another value.`,
    );
  });

  it('Should fail to register is user email is on wrong forma', async () => {
    const userData = userFactory({ email: 'invalid-format' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Please provide valid email`);
  });

  it('Should fail when firstName contains number', async () => {
    const userData = userFactory({ firstName: '1234Hello' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Fist name should be only letters`);
  });

  it('Should fail when firstName contains special characters', async () => {
    const userData = userFactory({ firstName: 'Hello@' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Fist name should be only letters`);
  });

  it('Should fail when lastName contains number', async () => {
    const userData = userFactory({ lastName: '1234Hello' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Last name should be only letters`);
  });

  it('Should fail when lastName contains special characters', async () => {
    const userData = userFactory({ lastName: 'Hello@' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(`Last name should be only letters`);
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

  it('Should fail to login if the email is not provided', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ password: 'userPassword' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email is required');
  });

  it('Should fail to login when password is not provided', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@email.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password is required');
  });

  it('Should fail when email is not good format', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'test@email', password: 'userPassword' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Please provide valid email');
  });

  it('Should fail when user provide wrong password', async () => {
    const userData = userFactory();
    await request(app)
      .post('/api/v1/auth/register')
      .send({
        ...userData,
        confirmPassword: userData.password,
      });

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: userData.email, password: 'invalidPassword' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('Should fail to login when email is not belongs to a account', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'unknown-email@email.com', password: 'userPassword' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('Should fail when user password is too short', async () => {
    const userData = userFactory({ password: 'HeloP@1' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Password must be at least 8 characters long',
    );
  });
  it('Should fail when password do not contains upcaseLetter', async () => {
    const userData = userFactory({ password: 'hellopa@1' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Password must contain at least one uppercase letter',
    );
  });

  it('Should fail when password do not contains number', async () => {
    const userData = userFactory({ password: 'Hellopa@' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Password must contain at least one number',
    );
  });

  it('Should fail when password do not contains special character', async () => {
    const userData = userFactory({ password: 'Hellopa12' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Password must contain at least one special character',
    );
  });

  it('Should fail when password and confirm password do not match', async () => {
    const userData = userFactory({ password: 'Hellopa12@' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: 'differentPassword' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      'Password and confirm password should match',
    );
  });

  it('Should fail when confirmPassword is missing', async () => {
    const userData = userFactory({ password: 'Hellopa12@' });
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(userData);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Please confirm your password');
  });
});
