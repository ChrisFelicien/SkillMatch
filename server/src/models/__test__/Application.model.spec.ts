import { connect, clearDatabase, closeDatabase } from '@/test/dbHandler';
import mongoose, { Types } from 'mongoose';
import Application from '@/models/Application.model';
import applicationFactory from '@/test/factory/ApplicationFactory';
import { ApplicationStatus } from '@/interfaces/IApplication';

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Test Application model', () => {
  it('Should submit a valid application', async () => {
    const applicationData = applicationFactory();

    const result = await Application.create(applicationData);

    expect(result.status).toBe(ApplicationStatus.PENDING);
    expect(result.createdAt).toBeDefined();
    expect(result.updatedAt).toBeDefined();
  });

  it('Should enforce unique freelancer and job application', async () => {
    const applicationData = applicationFactory();
    await Application.create(applicationData);

    await expect(Application.create(applicationData)).rejects.toMatchObject({
      code: 11000,
    });
  });

  it('Should fail when job does not exist', async () => {
    const applicationData = applicationFactory({ job: null as any });
    await expect(Application.create(applicationData)).rejects.toThrow(
      'Please provide the job id',
    );
  });

  it('Should fail when company does not exist', async () => {
    const applicationData = applicationFactory({ company: null as any });
    await expect(Application.create(applicationData)).rejects.toThrow(
      'Please provide company id',
    );
  });

  it('Should fail when freelancer does not exist', async () => {
    const applicationData = applicationFactory({ freelancer: null as any });
    await expect(Application.create(applicationData)).rejects.toThrow(
      'Please provide the freelancer id',
    );
  });

  it('Should fail when status is invalid', async () => {
    const applicationData = applicationFactory({
      status: 'invalid-status' as any,
    });
    await expect(Application.create(applicationData)).rejects.toThrow();
  });

  it('Should fail when coverLetter is empty string', async () => {
    const applicationData = applicationFactory({
      coverLetter: '',
    });
    await expect(Application.create(applicationData)).rejects.toThrow(
      'Please provide the cover letter',
    );
  });

  it('Should fail when resume is empty string', async () => {
    const applicationData = applicationFactory({
      resume: '',
    });
    await expect(Application.create(applicationData)).rejects.toThrow(
      'Please provide the resume',
    );
  });
});
