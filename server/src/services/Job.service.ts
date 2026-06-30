import IJob from '@/interfaces/IJob';
import Job from '@/models/Job.model';
import AppError from '@/utils/AppError';
import { Types } from 'mongoose';

class JobService {
  async createJob(clientId: Types.ObjectId, jobData: IJob) {
    const newJob = await Job.create({ ...jobData, client: clientId });

    return {
      message: 'New job created',
      job: newJob,
    };
  }

  async deleteJob(clientId: Types.ObjectId, jobId: string) {
    // first get the current job
    const job = await Job.findById(jobId);

    if (!job) {
      throw new AppError('No job found with this id', 404);
    }

    // Check if job belongs to the current user
    if (clientId.toString() !== job.client.toString()) {
      throw new AppError('Sorry you are not allowed to delete this job', 401);
    }

    return {
      message: 'Job deleted',
    };
  }

  async getSingleJob(jobId: string) {
    const currentJob = await Job.findById(jobId);
    if (!currentJob) {
      throw new AppError('No job found with this id', 404);
    }

    return {
      job: currentJob,
    };
  }

  async updateJob(
    userId: Types.ObjectId,
    jobId: string,
    jobData: Partial<IJob>,
  ) {
    const currentJob = await Job.findById(jobId);

    if (!currentJob) {
      throw new AppError('No job found with this id', 404);
    }

    if (currentJob.client.toString() !== userId.toString()) {
      throw new AppError('Sorry you are not allowed to updated this job', 403);
    }
    delete jobData.client;
    delete jobData.company;
    currentJob.set(jobData);

    await currentJob.save();

    return {
      job: currentJob,
    };
  }
}

export default new JobService();
