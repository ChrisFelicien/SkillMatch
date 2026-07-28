import request from 'supertest';
import app from '@/app';
import companyFactory from '@/test/factory/CompanyFactory';
import userFactory from '@/test/factory/UserFactory';
import { connect, closeDatabase, clearDatabase } from '@/test/dbHandler';
import User from '@/models/User.model';
import { UserRoles } from '@/interfaces/IUser';
import { Types } from 'mongoose';
import Company from '@/models/Company.model';
import { CompanyStatus } from '@/interfaces/ICompany';

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

describe('Test get all request', () => {
  it('Admin can retrieve all pending request', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const userAdmin = userFactory({ email: 'admin@admin.com' });
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user._id });

    const result1 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result1.body.user._id,
      {
        role: UserRoles.ADMIN,
      },
      { new: true },
    );

    const response = await agent.get('/api/v1/companies');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('All waiting request');
    expect(response.body.total).toBe(1);
    expect(response.body.requests).toHaveLength(1);
  });

  it('Should fail when user is not authenticated', async () => {
    const response = await request(app).get('/api/v1/companies');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('No access provided');
  });

  it('Should fail when user is freelancer', async () => {
    const userData = userFactory();

    await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const response = await agent.get('/api/v1/companies');

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe(
      'You are not allowed to perform this action',
    );
  });

  it('Should fail when user is client', async () => {
    const userData = userFactory();

    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(result.body.user._id, {
      role: UserRoles.CLIENT,
    });

    const response = await agent.get('/api/v1/companies');

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe(
      'You are not allowed to perform this action',
    );
  });
});

describe('Test get single request', () => {
  it('Should return a single request', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const userAdmin = userFactory({ email: 'admin@admin.com' });

    const result1 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result2 = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result1.body.user._id });

    const result3 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userData.password });

    const user = await User.findByIdAndUpdate(
      result3.body.user._id,
      {
        role: UserRoles.ADMIN,
      },
      { new: true },
    );

    const response = await agent.get(
      `/api/v1/companies/${result2.body.request._id}`,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Single request');
    expect(response.body.request.name).toBe(companyData.name);
    expect(response.body.request.owner).toEqual(result1.body.user._id);
  });

  it('Should fail if the user is not authenticated', async () => {
    const id = new Types.ObjectId();
    const response = await request(app).get(`/api/v1/companies/${id}`);

    expect(response.statusCode).toBe(401);
  });

  it('Should fail when user is not admin', async () => {
    const userData = userFactory();
    const id = new Types.ObjectId();

    await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const response = await agent.get(`/api/v1/companies/${id}`);

    expect(response.statusCode).toBe(403);
  });

  it('Should fail when request doest not exist', async () => {
    const userData = userFactory();
    const id = new Types.ObjectId();

    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(result.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const response = await agent.get(`/api/v1/companies/${id}`);

    expect(response.statusCode).toBe(404);
  });

  it('Should fail when the provide id is wrong', async () => {
    const userData = userFactory();

    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(result.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const response = await agent.get(`/api/v1/companies/invalid-mongo-id`);

    expect(response.statusCode).toBe(400);
  });
});

describe('Test to approve request', () => {
  it('Should approve request', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const userAdmin = userFactory({ email: 'admin@admin.com' });
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result1 = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user._id });

    const result2 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result2.body.user._id,
      { role: UserRoles.ADMIN },
      { new: true },
    );

    const id = result1.body.request._id;

    const response = await agent.patch(`/api/v1/companies/${id}/approve`);

    expect(response.statusCode).toBe(200);
    expect(response.body.request.status).toBe(CompanyStatus.APPROVED);
  });

  it('Should fail when user is not authenticated', async () => {
    const id = new Types.ObjectId();
    const response = await request(app).patch(
      `/api/v1/companies/${id}/approve`,
    );

    expect(response.statusCode).toBe(401);
  });

  it('Should fail when user is not admin', async () => {
    const userData = userFactory();
    const id = new Types.ObjectId();

    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const response = await agent.patch(`/api/v1/companies/${id}/approve`);

    expect(response.statusCode).toBe(403);
  });

  it('SHould fail when request doest not exist', async () => {
    const userAdmin = userFactory({ email: 'admin@admin.com' });
    const userData = userFactory();
    const result2 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result2.body.user._id,
      { role: UserRoles.ADMIN },
      { new: true },
    );

    const id = new Types.ObjectId();

    const response = await agent.patch(`/api/v1/companies/${id}/approve`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('No request found with this id');
  });

  it('Should fail if the request has been already approved', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const userAdmin = userFactory({ email: 'admin@admin.com' });
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result1 = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user._id });

    const result2 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result2.body.user._id,
      { role: UserRoles.ADMIN },
      { new: true },
    );

    const id = result1.body.request._id;
    await agent.patch(`/api/v1/companies/${id}/approve`);
    const response = await agent.patch(`/api/v1/companies/${id}/approve`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('This request has been processed');
  });

  it('Should fail if the request has been already rejected', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const userAdmin = userFactory({ email: 'admin@admin.com' });
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result1 = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user._id });

    await Company.findByIdAndUpdate(result1.body.request._id, {
      status: CompanyStatus.REJECTED,
    });

    const result2 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result2.body.user._id,
      { role: UserRoles.ADMIN },
      { new: true },
    );

    const id = result1.body.request._id;

    const response = await agent.patch(`/api/v1/companies/${id}/approve`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('This request has been processed');
  });

  it('It should fail when request owner is no longer exist', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const userAdmin = userFactory({ email: 'admin@admin.com' });
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result1 = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user._id });

    await User.findByIdAndDelete(result.body.user._id);

    const result2 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result2.body.user._id,
      { role: UserRoles.ADMIN },
      { new: true },
    );

    const id = result1.body.request._id;

    const response = await agent.patch(`/api/v1/companies/${id}/approve`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('No user find.');
  });
});

describe('Test to reject client request', () => {
  it('Should reject client request', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const userAdmin = userFactory({ email: 'admin@admin.com' });
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result1 = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user._id });

    const result2 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result2.body.user._id,
      { role: UserRoles.ADMIN },
      { new: true },
    );

    const id = result1.body.request._id;

    const response = await agent.patch(`/api/v1/companies/${id}/reject`);

    expect(response.statusCode).toBe(200);
    expect(response.body.request.status).toBe(CompanyStatus.REJECTED);
  });

  it('Should fail if user is not a admin', async () => {
    const userData = userFactory();
    const id = new Types.ObjectId();
    //  const companyData = companyFactory();
    //  const userAdmin = userFactory({ email: 'admin@admin.com' });
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const response = await agent.patch(`/api/v1/companies/${id}/reject`);

    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe(
      'You are not allowed to perform this action',
    );
  });

  it('Should fail when the request is not exist', async () => {
    const id = new Types.ObjectId();

    const userAdmin = userFactory({ email: 'admin@admin.com' });

    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userAdmin.password });

    await User.findByIdAndUpdate(result.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const response = await agent.patch(`/api/v1/companies/${id}/reject`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('No request found with this id');
  });

  it('Should fail when request is already rejected', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const userAdmin = userFactory({ email: 'admin@admin.com' });
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result1 = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user._id });

    await Company.findByIdAndUpdate(result1.body.request._id, {
      status: CompanyStatus.REJECTED,
    });

    const result2 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result2.body.user._id,
      { role: UserRoles.ADMIN },
      { new: true },
    );

    const id = result1.body.request._id;

    const response = await agent.patch(`/api/v1/companies/${id}/reject`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('This request has been processed');
  });

  it('Should fail when the request has already been approved', async () => {
    const userData = userFactory();
    const companyData = companyFactory();
    const userAdmin = userFactory({ email: 'admin@admin.com' });
    const result = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result1 = await agent
      .post('/api/v1/companies')
      .send({ ...companyData, owner: result.body.user._id });

    await Company.findByIdAndUpdate(result1.body.request._id, {
      status: CompanyStatus.APPROVED,
    });

    const result2 = await agent
      .post('/api/v1/auth/register')
      .send({ ...userAdmin, confirmPassword: userData.password });

    await User.findByIdAndUpdate(
      result2.body.user._id,
      { role: UserRoles.ADMIN },
      { new: true },
    );

    const id = result1.body.request._id;

    const response = await agent.patch(`/api/v1/companies/${id}/reject`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('This request has been processed');
  });
});
