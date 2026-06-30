import { clearDatabase, closeDatabase, connect } from '@/test/dbHandler';
import Job from '@/models/Job.model';
import User from '@/models/User.model';
import userFactory from '@/test/factory/UserFactory';
import jobFactory from '@/test/factory/JobFactory';
import IJob from '@/interfaces/IJob';

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Test job model', () => {
  it('Should create valid job', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({ client: user._id });
    const job = await Job.create(jobData);

    expect(job.title).toBe(jobData.title);
    expect(job.company).toBe(jobData.company);
  });

  it('Should fail when title is not provided', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({ title: '', client: user._id });

    await expect(Job.create(jobData)).rejects.toThrow('Job must have a title');
  });
  it('Should fail when title is too short', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({ title: 'soft', client: user._id });

    await expect(Job.create(jobData)).rejects.toThrow(
      'Job title cannot be less than 5 characters',
    );
  });

  it('Should fail when description is not provided', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({ description: '', client: user._id });

    await expect(Job.create(jobData)).rejects.toThrow(
      'Job must have a description',
    );
  });
  it('Should fail when title is too short', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({ description: 'soft', client: user._id });

    await expect(Job.create(jobData)).rejects.toThrow(
      'Job description cannot be less than 50 characters',
    );
  });

  it('Should fail when location is not provided', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({ location: '', client: user._id });

    await expect(Job.create(jobData)).rejects.toThrow('Provide job location');
  });
  it('Should fail when location is too short', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({ location: 'so', client: user._id });

    await expect(Job.create(jobData)).rejects.toThrow(
      'Job location cannot be less than 3 characters',
    );
  });

  it('Should fail when the job salary min is less than zero', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({
      salary: {
        min: -10,
        max: 1000,
        currency: 'USD',
      },
      client: user._id,
    });

    await expect(Job.create(jobData)).rejects.toThrow();
  });

  it('Should fail when the job salary currency is less than 3', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({
      salary: {
        min: 100,
        max: 1000,
        currency: 'US',
      },
      client: user._id,
    });

    await expect(Job.create(jobData)).rejects.toThrow(
      'Currency cannot be less than 3 characters',
    );
  });

  it('Should fail when job skills is missing', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({
      skills: [],
      client: user._id,
    });

    await expect(Job.create(jobData)).rejects.toThrow(
      'Job must contain between 1 and 20 skills',
    );
  });

  it('Should fail when job skills is more than 20', async () => {
    const user = await User.create(userFactory());
    const jobData = jobFactory({
      skills: [
        'html',
        'css',
        'js',
        'react',
        'node',
        'express',
        'jquery',
        'jest',
        'angular',
        'react native',
        'go',
        'java',
        'c++',
        'c#',
        'mongo',
        'sql',
        'windows',
        'unix',
        'git',
        'devops',
        'github',
        'api',
      ],
      client: user._id,
    });

    await expect(Job.create(jobData)).rejects.toThrow(
      'Job must contain between 1 and 20 skills',
    );
  });
});
