import { Request, Response, NextFunction } from 'express';
import JobService from '@/services/Job.service';
import AppError from '@/utils/AppError';

class JobController {
  async createJob(req: Request, res: Response, next: NextFunction) {
    const jobData = req.body;
    const clientId = req.user?._id;

    if (!clientId) {
      return next(new AppError('Client id is required', 400));
    }

    const { message, job } = await JobService.createJob(clientId, jobData);

    return res.status(201).json({
      success: true,
      message,
      job,
    });
  }

  async deleteJob(req: Request, res: Response, next: NextFunction) {
    const clientId = req.user?._id;
    const jobId = req.params.jobId;
    if (!clientId) {
      return next(new AppError('Client id is required', 400));
    }

    if (!jobId || typeof jobId !== 'string') {
      return next(new AppError('Job id is required and must be a string', 400));
    }

    await JobService.deleteJob(clientId, jobId);

    return res.status(204).end();
  }

  async getSingleJob(req: Request, res: Response, next: NextFunction) {
    const jobId = req.params.jobId;

    if (!jobId || typeof jobId !== 'string') {
      return next(new AppError('Job id is required and must be a string', 400));
    }

    const result = await JobService.getSingleJob(jobId);

    return res.status(200).json({
      job: result.job,
    });
  }

  async getAllJobs(req: Request, res: Response, next: NextFunction) {
    const { result, message, jobs } = await JobService.getAllJobs();

    return res.status(200).json({
      total: result,
      message,
      jobs,
    });
  }

  async updateJob(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?._id;
    const jobId = req.params.jobId;
    const jobData = req.body;

    if (!userId) {
      return next(new AppError('User id is required', 400));
    }

    if (!jobId || typeof jobId !== 'string') {
      return next(new AppError('job id is required and must be string', 400));
    }

    const { job, message } = await JobService.updateJob(userId, jobId, jobData);

    return res.status(200).json({
      message,
      job: job,
    });
  }
}

export default new JobController();
