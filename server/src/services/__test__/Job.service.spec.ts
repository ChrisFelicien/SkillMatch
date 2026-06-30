import { connect, clearDatabase, closeDatabase } from '@/test/dbHandler';
import userFactory from '@/test/factory/UserFactory';
import jobFactory from '@/test/factory/JobFactory';
import User from '@/models/User.model';
import JobService from '@/services/Job.service';
import mongoose from 'mongoose';

const userData = userFactory();

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Test job service', () => {
  it('Should create valid job', async () => {
    const newId1 = new mongoose.Types.ObjectId();
    const jobData = jobFactory();

    const result = await JobService.createJob(newId1, jobData);
    expect(result.job.client.toString()).toBe(newId1.toString());
  });

  it('Should delete a job', async () => {
    const newId1 = new mongoose.Types.ObjectId();
    const jobData = jobFactory();

    const { job } = await JobService.createJob(newId1, jobData);

    const result = await JobService.deleteJob(newId1, job._id.toString());

    expect(result.message).toBe('Job deleted');
  });
  it('Should fail to delete if job do not belongs to user', async () => {
    const newId1 = new mongoose.Types.ObjectId();
    const newId2 = new mongoose.Types.ObjectId();
    const jobData = jobFactory();

    const { job } = await JobService.createJob(newId1, jobData);

    await expect(
      JobService.deleteJob(newId2, job._id.toString()),
    ).rejects.toThrow('Sorry you are not allowed to delete this job');
  });

  it('Should fail to delete if no job found with this id', async () => {
    const newId1 = new mongoose.Types.ObjectId();
    const newId = new mongoose.Types.ObjectId();

    await expect(
      JobService.deleteJob(newId1, newId.toString()),
    ).rejects.toThrow('No job found with this id');
  });

  it('Should found a single job', async () => {
    const newId1 = new mongoose.Types.ObjectId();
    const jobData = jobFactory();
    const { job } = await JobService.createJob(newId1, jobData);

    const result = await JobService.getSingleJob(job._id.toString());
    expect(result.job.title).toBeDefined();
    expect(result.job.client.toString()).toBe(newId1.toString());
  });

  it('Should not return a job when no job have this id', async () => {
    const newId = new mongoose.Types.ObjectId().toString();

    await expect(JobService.getSingleJob(newId)).rejects.toThrow(
      'No job found with this id',
    );
  });

  it('Should not update if no job have the id', async () => {
    const newId1 = new mongoose.Types.ObjectId();
    const newId2 = new mongoose.Types.ObjectId().toString();

    await expect(
      JobService.updateJob(newId1, newId2, jobFactory()),
    ).rejects.toThrow('No job found with this id');
  });

  it('Should fail to update the job if job do not belongs to user', async () => {
    const newId1 = new mongoose.Types.ObjectId();
    const newId2 = new mongoose.Types.ObjectId();

    const jobData = jobFactory();
    const { job } = await JobService.createJob(newId1, jobData);

    await expect(
      JobService.updateJob(newId2, job._id.toString(), jobFactory()),
    ).rejects.toThrow('Sorry you are not allowed to updated this job');
  });

  it('Should update the job data', async () => {
    const newId1 = new mongoose.Types.ObjectId();

    const jobData = jobFactory();
    const { job } = await JobService.createJob(newId1, jobData);

    const result = await JobService.updateJob(
      newId1,
      job._id.toString(),
      jobFactory({ title: 'New job title' }),
    );

    expect(result.job.title).toBe('New job title');
  });
});
