import request from 'supertest';
import app from '@/app';
import companyFactory from '@/test/factory/CompanyFactory';
import userFactory from '@/test/factory/UserFactory';
import { connect, closeDatabase, clearDatabase } from '@/test/dbHandler';
import User from '@/models/User.model';
import { Types } from 'mongoose';
import { UserRoles } from '@/interfaces/IUser';

const agent = request.agent(app);

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Test submit company integration request', () => {
  it('Should create valid request to be client', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const response = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user?._id });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('Request sent.');
    expect(response.body.request).toBeDefined();
  });

  it('Should fail when user is not authenticated', async () => {
    const response = await request(app).post('/api/v1/companies');

    expect(response.status).toBe(401);
  });

  it('it should fail when user is already client', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result.body.user._id,
      {
        role: UserRoles.CLIENT,
      },
      { new: true },
    );

    const response = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user?._id });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe(
      'You are not allowed to perform this action',
    );
  });

  it('it should fail when user is already admin', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result.body.user._id,
      {
        role: UserRoles.ADMIN,
      },
      { new: true },
    );

    const response = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user?._id });

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe(
      'You are not allowed to perform this action',
    );
  });

  it('it should fail when company name is missing', async () => {
    const userData = userFactory();
    const companyData = companyFactory({ name: false as any });

    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const response = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user?._id });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Company name is required');
  });

  it('Should fail when user has already submitted request', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user?._id });

    const response = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user?._id });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('You already submitted a request.');
  });

  it('Should fail when owner is missing', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const response = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: false as any });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Owner id is required');
  });
});
