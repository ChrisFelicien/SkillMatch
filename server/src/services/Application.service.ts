import { ApplyToJobDTO } from '@/interfaces/IApplication';
import { JobStatus } from '@/interfaces/IJob';
import { UserRoles } from '@/interfaces/IUser';
import Application from '@/models/Application.model';
import Company from '@/models/Company.model';
import Job from '@/models/Job.model';
import User from '@/models/User.model';
import AppError from '@/utils/AppError';
import { Types } from 'mongoose';

class ApplicationService {
  async applyToJob(data: ApplyToJobDTO) {
    const { freelancer, job, company, coverLetter, resume } = data;

    if (!freelancer || !job || !company || !coverLetter || !resume) {
      throw new AppError('Missing required field', 400);
    }
    // 1. Be sure the job and company exist
    const jobExist = await Job.findById(job);
    const companyExist = await Company.findById(company);

    if (!jobExist || !companyExist) {
      throw new AppError('Sorry, Company or job not found.', 404);
    }

    // 2. check if the job still open
    if (jobExist.status !== JobStatus.OPEN) {
      throw new AppError('Sorry, application for this position is closed', 400);
    }
    const freelancerExist = await User.findById(freelancer);

    if (!freelancerExist) throw new AppError('Freelancer not found', 404);

    // 5. check if the job belong to the company
    if (!jobExist.client.equals(company)) {
      throw new AppError(
        'This job does not belong to the specified company.',
        400,
      );
    }

    // 6. check if user has already applied
    const alreadyApplied = await Application.findOne({
      freelancer,
      job,
    });

    if (alreadyApplied) {
      throw new AppError('You have already applied to this position', 400);
    }

    const application = await Application.create({
      freelancer,
      job,
      company,
      resume,
      coverLetter,
    });

    return {
      message: 'Application sent',
      application,
    };
  }
  async getApplicationsByJob(
    jobId: string,
    currentUserId: Types.ObjectId,
    currentUserRole: UserRoles,
  ) {
    const job = await Job.findById(jobId);

    if (!job) throw new AppError('No job found.', 404);

    if (
      !job.client.equals(currentUserId) &&
      currentUserRole !== UserRoles.ADMIN
    ) {
      throw new AppError(
        'You are not authorized to view these application',
        403,
      );
    }

    const applications = await Application.find({ job: jobId }).sort({
      createdAt: -1,
    });

    return {
      message: 'Applications retrieved successfully',
      total: applications.length,
      applications,
    };
  }
  async getMyApplications(jobId: string, currentUserId: Types.ObjectId) {
    const job = await Job.findById(jobId);

    if (!job) throw new AppError('No job found.', 404);

    const applications = await Application.find({
      freelancer: currentUserId,
      job: jobId,
    }).sort({ createdAt: -1 });

    return {
      message: 'Applications retrieved successfully',
      total: applications.length,
      applications,
    };
  }
  async getApplicationById(
    applicationId: string,
    currentUserId: Types.ObjectId,
    currentUserRole: UserRoles,
  ) {
    const application = await Application.findById(applicationId);

    if (!application) throw new AppError('No application found.', 404);

    if (currentUserRole !== UserRoles.ADMIN) {
      const job = await Job.findOne(application.job);

      if (!job) throw new AppError('No job found', 404);

      if (!job.client.equals(currentUserId)) {
        throw new AppError(
          'You are not authorized to view this application.',
          403,
        );
      }
    }

    return {
      message: 'Single job application',
      application,
    };
  }
  getAllApplications() {}
  updateApplicationStatus() {}
  withdrawApplication() {}
  deleteApplication() {} //(optional, admin)
}

export default new ApplicationService();
