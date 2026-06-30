import IJob, {
  JobEmploymentType,
  JobExperienceLevel,
  JobLocationType,
} from '@/interfaces/IJob';

const jobFactory = (override?: Partial<IJob>): IJob =>
  ({
    title: 'Software Engineer',
    description:
      'A software developer designs, codes, tests, and maintains computer programs, mobile apps, or operating systems. They analyze user needs to build scalable software, debug issues, and collaborate with cross-functional teams to deliver secure, client-focused solutions.',
    company: 'Google',
    location: 'USA',
    jobLocationType: JobLocationType.REMOTE,
    employmentType: JobEmploymentType.FULL_TIME,
    salary: { min: 500, max: 3200, currency: 'USD' },
    skills: ['html', 'css', 'javascript', 'react', 'node', 'express'],
    experienceLevel: JobExperienceLevel.MID,
    ...override,
  }) as IJob;

export default jobFactory;
