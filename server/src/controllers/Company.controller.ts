import CompanyService from '@/services/Company.service';
import AppError from '@/utils/AppError';
import { Request, Response, NextFunction } from 'express';

class CompanyController {
  async submitClientRequest(req: Request, res: Response, next: NextFunction) {
    const data = req.body;
    const owner = req.user?._id;

    if (!owner) {
      return next(new AppError('Owner id is required', 400));
    }

    if (!data.name) {
      return next(new AppError('Company name is required', 400));
    }

    const { message, request } = await CompanyService.submitClientRequest(
      owner,
      data,
    );

    return res.status(201).json({
      message,
      request,
    });
  }

  async getAllRequests(req: Request, res: Response, next: NextFunction) {
    const { message, total, requests } = await CompanyService.getAllRequests();

    return res.status(200).json({
      message,
      total,
      requests,
    });
  }

  async getSingleRequest(req: Request, res: Response, next: NextFunction) {
    const requestId = req.params.requestId;

    if (!requestId || typeof requestId !== 'string') {
      return next(new AppError('Please provide the request id', 400));
    }

    const { message, request } =
      await CompanyService.getSingleRequest(requestId);

    return res.status(200).json({
      message,
      request,
    });
  }

  async approveClientRequest(req: Request, res: Response, next: NextFunction) {
    const requestId = req.params.requestId;

    if (!requestId || typeof requestId !== 'string') {
      return next(
        new AppError('Request id is required and must be string', 400),
      );
    }

    const { message, request } =
      await CompanyService.approveClientRequest(requestId);

    return res.status(200).json({
      message,
      request,
    });
  }

  async rejectClientRequest(req: Request, res: Response, next: NextFunction) {
    const requestId = req.params.requestId;

    if (!requestId || typeof requestId !== 'string') {
      return next(
        new AppError('Request id is required and must be string', 400),
      );
    }

    const { message, request } =
      await CompanyService.rejectClientRequest(requestId);

    return res.status(200).json({
      message,
      request,
    });
  }
}

export default new CompanyController();
