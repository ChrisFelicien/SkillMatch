import { ApplyToJobDTO } from '@/interfaces/IApplication';
import { JobStatus } from '@/interfaces/IJob';
import Application from '@/models/Application.model';
import Company from '@/models/Company.model';
import Job from '@/models/Job.model';
import User from '@/models/User.model';
import AppError from '@/utils/AppError';

class ApplicationService {
  async applyToJob(data: ApplyToJobDTO) {
    // 1. Be sure the job and company exist
    const jobExist = await Job.findById(data.job);
    const companyExist = await Company.findById(data.company);

    if (!jobExist || !companyExist) {
      throw new AppError('Sorry, Company or job not found.', 404);
    }

    // 2. check if the job still open
    if (jobExist.status !== JobStatus.OPEN) {
      throw new AppError('Sorry, application for this position is closed', 400);
    }
    const freelancer = await User.findById(data.freelancer);

    if (!freelancer) throw new AppError('Freelancer not found', 404);

    // 5. check if the job belong to the company
    if (!jobExist.client.equals(data.company)) {
      throw new AppError(
        'This job does not belong to the specified company.',
        400,
      );
    }

    // 6. check if user has already applied
    const alreadyApplied = await Application.findOne({
      freelancer: data.freelancer,
      job: data.job,
    });

    if (alreadyApplied) {
      throw new AppError('You have already applied to this position', 400);
    }

    // 4. Check if covert letter or resume doesn't exist (will be link)
    if (!data.coverLetter || !data.resume) {
      throw new AppError('Please provide the cover letter and the resume', 400);
    }

    const application = await Application.create({
      freelancer: data.freelancer,
      job: data.job,
      company: data.company,
      resume: data.resume,
      coverLetter: data.coverLetter,
    });

    return {
      message: 'Application sent',
      application,
    };
  }
  getAllApplications() {}
  getApplicationById() {}
  getApplicationsByJob() {}
  getMyApplications() {}
  updateApplicationStatus() {}
  withdrawApplication() {}
  deleteApplication() {} //(optionnel, admin)
}

export default new ApplicationService();
