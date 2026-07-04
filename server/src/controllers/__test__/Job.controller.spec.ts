import app from '@/app';
import request from 'supertest';
import userFactory from '@/test/factory/UserFactory';
import { connect, closeDatabase, clearDatabase } from '@/test/dbHandler';
import jobFactory from '@/test/factory/JobFactory';
import { UserRoles } from '@/interfaces/IUser';
import User from '@/models/User.model';
import Job from '@/models/Job.model';
import mongoose from 'mongoose';

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Test the job controller create job case', () => {
  it('Should fail to create job if the user is not admin or client', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result = await agent.post('/api/v1/jobs').send(jobData);

    expect(result.statusCode).toBe(403);
    expect(result.body.message).toBe(
      'You are not allowed to perform this action',
    );
  });

  it('Should fail to create a job if we are not authenticated', async () => {
    const jobData = jobFactory();
    const agent = request.agent(app);
    const result = await agent.post('/api/v1/jobs').send(jobData);

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe('No access provided');
  });
  it('Should create valid job when user is a client', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.CLIENT,
    });

    const result = await agent.post('/api/v1/jobs').send(jobData);

    expect(result.statusCode).toBe(201);
    expect(result.body.message).toBe('New job created');
    expect(result.body.job.title).toBe(jobData.title);
    expect(result.body.job.company).toBe(jobData.company);
    expect(result.body.job.client).toBe(response.body.user._id);
  });

  it('Should create valid job when user is a admin', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send(jobData);

    expect(result.statusCode).toBe(201);
    expect(result.body.message).toBe('New job created');
    expect(result.body.job.title).toBe(jobData.title);
    expect(result.body.job.company).toBe(jobData.company);
    expect(result.body.job.client).toBe(response.body.user._id);
  });

  it('Should fail when the job title is empty string', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory({ title: '' });

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send(jobData);

    expect(result.body.message).toBe(
      'Job title cannot be less than 5 characters',
    );
  });

  it('Should fail when the job title is less than 5 characters', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory({ title: 'nice' });

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send(jobData);

    expect(result.body.message).toBe(
      'Job title cannot be less than 5 characters',
    );
  });

  it('Should fail when the job title is not provided', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent
      .post('/api/v1/jobs')
      .send({ ...jobData, title: null });

    expect(result.body.message).toBe('Job must have a title');
  });

  it('Should fail when the job description is not provided', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent
      .post('/api/v1/jobs')
      .send({ ...jobData, description: null });

    expect(result.body.message).toBe('Job must have a description');
  });

  it('Should fail when the job description is less than 50 characters', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      description: 'This is the job description for provided position',
    });

    expect(result.body.message).toBe(
      'Job description cannot be less than 50 characters',
    );
  });

  it('Should fail when the job location is not provided', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      location: null,
    });

    expect(result.body.message).toBe('Provide job location');
  });

  it('Should fail when the job location is less than 3 characters', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      location: 'Be',
    });

    expect(result.body.message).toBe(
      'Job location cannot be less than 3 characters',
    );
  });

  it('Should fail when the job employment type is not provided', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      employmentType: null,
    });

    expect(result.body.message).toBe(
      'Invalid employment type. Expected full-time, part-time,contract, internship, or freelance, but received: "null"',
    );
  });

  it('Should fail when the job employment type is wrong type', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      employmentType: 'invalid',
    });

    expect(result.body.message).toBe(
      'Invalid employment type. Expected full-time, part-time,contract, internship, or freelance, but received: "invalid"',
    );
  });

  it('Should fail when the job location type is wrong type', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      jobLocationType: 'invalid',
    });

    expect(result.body.message).toBe(
      `Invalid job location type. Expected full-time, part-time,contract, internship, or freelance, but received: "invalid"`,
    );
  });

  it('Should fail when the job minimum salary is missing', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      salary: { min: null, max: 1000, currency: 'USD' },
    });

    expect(result.body.message).toBe(
      'Please provide minimum salary for this position',
    );
  });

  it('Should fail when the job minimum salary less than zero', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      salary: { min: -100, max: 1000, currency: 'USD' },
    });

    expect(result.body.message).toBe('The minimum salary cannot be negative');
  });

  it('Should fail when the job maximum salary is missing', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      salary: { min: 100, max: null, currency: 'USD' },
    });

    expect(result.body.message).toBe(
      'Please provide maximum salary for this position',
    );
  });

  it('Should fail when the min salary is high than max salary', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      salary: { min: 100, max: 50, currency: 'USD' },
    });

    expect(result.body.message).toBe(
      'The minimum salary should be less than the maximum salary',
    );
  });

  it('Should fail when the salary currency is missing', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      salary: { min: 100, max: 500, currency: null },
    });

    expect(result.body.message).toBe(
      `Invalid currency. Expected 'USD', 'EUR', 'GBP', 'JPY', 'ZAR', 'CAD', 'AUD', but received: "null"`,
    );
  });

  it('Should fail when the salary currency is wrong format', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      salary: { min: 100, max: 500, currency: 'invalid-format' },
    });

    expect(result.body.message).toBe(
      `Invalid currency. Expected 'USD', 'EUR', 'GBP', 'JPY', 'ZAR', 'CAD', 'AUD', but received: "invalid-format"`,
    );
  });

  it('Should fail when the company is missing', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      company: null,
    });

    expect(result.body.message).toBe(`Please provide your company.`);
  });

  it('Should fail when the company is less than 3 characters', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      company: 'AB',
    });

    expect(result.body.message).toBe(
      `Company name cannot be less than 3 characters`,
    );
  });

  it('Should fail when the job skills is not provided', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      skills: null,
    });

    expect(result.body.message).toBe(
      `Invalid input: expected array, received null`,
    );
  });

  it('Should fail when the job skills is empty array', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      skills: [],
    });

    expect(result.body.message).toBe(
      `Job should have at least one required skills`,
    );
  });

  it('Should fail when skills list is more than 20', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      skills: [
        'html',
        'css',
        'react',
        'windows',
        'unix',
        'lunix',
        'windev',
        'mongo',
        'mongoose',
        'test',
        'jest',
        'angular',
        'nextJs',
        'c++',
        'c#',
        'php',
        'laravel',
        'java',
        'python',
        'go',
        'f#',
      ],
    });

    expect(result.body.message).toBe(`Job skills cannot exceed 20`);
  });

  it('Should fail when experience level is missing', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      experienceLevel: null,
    });

    expect(result.body.message).toBe(
      `Invalid experience level provide. Expected junior, mid, senior,  or lead, but received: "null"`,
    );
  });

  it('Should fail when experience level is invalid format', async () => {
    const agent = request.agent(app);

    const userData = userFactory();
    const jobData = jobFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.ADMIN,
    });

    const result = await agent.post('/api/v1/jobs').send({
      ...jobData,
      experienceLevel: 'invalid',
    });

    expect(result.body.message).toBe(
      `Invalid experience level provide. Expected junior, mid, senior,  or lead, but received: "invalid"`,
    );
  });
});

describe('Test job controller case get single job', () => {
  it('Should return a single job', async () => {
    const clientId1 = new mongoose.Types.ObjectId();
    const clientId2 = new mongoose.Types.ObjectId();

    const jobData = jobFactory();

    const job = await Job.create({
      ...jobData,
      title: 'testing job title',
      client: clientId1,
    });

    await Job.insertMany([
      { ...jobData, client: clientId1 },
      { ...jobData, client: clientId2 },
    ]);

    const response = await request.agent(app).get(`/api/v1/jobs/${job._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.job.title).toBe('testing job title');
    expect(response.body.job.client).toBe(clientId1.toString());
  });

  it('should fail to fetch one job if there is no job match to the id', async () => {
    const jobId = new mongoose.Types.ObjectId();
    const response = await request.agent(app).get(`/api/v1/jobs/${jobId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe('No job found with this id');
  });
});

describe('Test job controller case get all jobs', () => {
  it('Should get all jobs', async () => {
    const clientId1 = new mongoose.Types.ObjectId();
    const clientId2 = new mongoose.Types.ObjectId();

    const jobData = jobFactory();

    await Job.insertMany([
      { ...jobData, client: clientId1 },
      { ...jobData, client: clientId2 },
      { ...jobData, client: clientId1 },
      { ...jobData, client: clientId2 },
    ]);

    const response = await request.agent(app).get(`/api/v1/jobs`);

    expect(response.statusCode).toBe(200);
    expect(response.body.jobs).toHaveLength(4);
  });

  it('Should return empty array when no jobs', async () => {
    const response = await request.agent(app).get(`/api/v1/jobs`);

    expect(response.statusCode).toBe(200);
    expect(response.body.jobs).toHaveLength(0);
  });
});

describe('Test job controller case delete a job', () => {
  it('Should not delete a job when we are not authenticated', async () => {
    const id = new mongoose.Types.ObjectId();
    const response = await request(app).delete(`/api/v1/jobs/${id}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('No access provided');
  });

  it('Should not delete a job when we are not client or admin', async () => {
    const agent = request.agent(app);
    const id = new mongoose.Types.ObjectId();

    const userData = userFactory();

    await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result = await agent.delete(`/api/v1/jobs/${id}`);

    expect(result.statusCode).toBe(403);
    expect(result.body.message).toBe(
      'You are not allowed to perform this action',
    );
  });

  it('Should not delete when you are not the job owner', async () => {
    const agent = request.agent(app);

    const userData = userFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.CLIENT,
    });

    const jobData = jobFactory();

    const id = new mongoose.Types.ObjectId();

    const job = await Job.create({ ...jobData, client: id });

    const result = await agent.delete(`/api/v1/jobs/${job._id}`);

    expect(result.statusCode).toBe(401);
    expect(result.body.message).toBe(
      'Sorry you are not allowed to delete this job',
    );
  });

  it('Should delete the job', async () => {
    const agent = request.agent(app);

    const userData = userFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.CLIENT,
    });

    const jobData = jobFactory();

    const job = await Job.create({
      ...jobData,
      client: response.body.user._id,
    });

    const result = await agent.delete(`/api/v1/jobs/${job._id}`);

    expect(result.statusCode).toBe(204);
  });
});

describe('Test job controller case updata a job', () => {
  it('Should not update a job when we are not authenticated', async () => {
    const id = new mongoose.Types.ObjectId();
    const response = await request(app).patch(`/api/v1/jobs/${id}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('No access provided');
  });

  it('Should not update a job when we are not client or admin', async () => {
    const agent = request.agent(app);
    const id = new mongoose.Types.ObjectId();

    const userData = userFactory();

    await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    const result = await agent.patch(`/api/v1/jobs/${id}`);

    expect(result.statusCode).toBe(403);
    expect(result.body.message).toBe(
      'You are not allowed to perform this action',
    );
  });

  it('Should not update when you are not the job owner', async () => {
    const agent = request.agent(app);

    const userData = userFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.CLIENT,
    });

    const jobData = jobFactory();

    const id = new mongoose.Types.ObjectId();

    const job = await Job.create({ ...jobData, client: id });

    const result = await agent.patch(`/api/v1/jobs/${job._id}`);

    expect(result.statusCode).toBe(403);
    expect(result.body.message).toBe(
      'Sorry you are not allowed to updated this job',
    );
  });

  it('Should update the job', async () => {
    const agent = request.agent(app);

    const userData = userFactory();

    const response = await agent
      .post('/api/v1/auth/register')
      .send({ ...userData, confirmPassword: userData.password });

    await User.findByIdAndUpdate(response.body.user._id, {
      role: UserRoles.CLIENT,
    });

    const jobData = jobFactory();

    const job = await Job.create({
      ...jobData,
      client: response.body.user._id,
    });

    const result = await agent
      .patch(`/api/v1/jobs/${job._id}`)
      .send({ title: 'New job title' });

    expect(result.statusCode).toBe(200);
  });
});
