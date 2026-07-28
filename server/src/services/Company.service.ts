import {
  CompanyStatus,
  ICompany,
  ICreateCompanyDto,
} from '@/interfaces/ICompany';
import { UserRoles } from '@/interfaces/IUser';
import Company from '@/models/Company.model';
import User from '@/models/User.model';
import AppError from '@/utils/AppError';
import { Types } from 'mongoose';

class CompanyService {
  async submitClientRequest(owner: Types.ObjectId, data: ICreateCompanyDto) {
    if (!owner) throw new AppError('Please provide owner id', 400);
    if (!data.name) throw new AppError('Please provide company name', 400);

    const existingRequest = await Company.findOne({ owner });

    if (existingRequest) {
      throw new AppError('You already submitted a request.', 400);
    }

    const request = await Company.create({ owner, ...data });

    return {
      message: 'Request sent.',
      request,
    };
  }

  async getAllRequests() {
    const requests = await Company.find({ status: CompanyStatus.PENDING });

    return {
      message: 'All waiting request',
      total: requests.length,
      requests,
    };
  }

  async getSingleRequest(requestId: string) {
    const request = await Company.findById(requestId);

    if (!request) {
      throw new AppError('No request found with this id', 404);
    }

    return {
      message: 'Single request',
      request,
    };
  }

  async approveClientRequest(requestId: string) {
    const request = await Company.findById(requestId);

    if (!request) {
      throw new AppError('No request found with this id', 404);
    }

    if (request.status !== CompanyStatus.PENDING) {
      throw new AppError('This request has been processed', 400);
    }

    const currentUser = await User.findById(request.owner);

    if (!currentUser) {
      throw new AppError('No user find.', 404);
    }

    request.status = CompanyStatus.APPROVED;
    currentUser.role = UserRoles.CLIENT;

    await Promise.all([currentUser.save(), request.save()]);

    return {
      message: 'The request is approved',
      request,
    };
  }

  async rejectClientRequest(requestId: string) {
    const request = await Company.findById(requestId);

    if (!request) {
      throw new AppError('No request found with this id', 404);
    }

    if (request.status !== CompanyStatus.PENDING) {
      throw new AppError('This request has been processed', 400);
    }

    request.status = CompanyStatus.REJECTED;

    await request.save();

    return {
      message: 'The request is rejected',
      request,
    };
  }
}

export default new CompanyService();
