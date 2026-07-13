import { Router } from 'express';
import JobController from '@/controllers/Job.controller';
import AuthMiddleware from '@/middlewares/Auth.middleware';
import { UserRoles } from '@/interfaces/IUser';
import catchAsyncError from '@/utils/catchAsyncError';
import validate from '@/middlewares/validate';
import { createJobSchema } from '@/schemas/JobSchema';

const router: Router = Router();

router
  .route('/')
  .get(JobController.getAllJobs)
  .post(
    AuthMiddleware.protect,
    AuthMiddleware.restrictTo([UserRoles.CLIENT, UserRoles.ADMIN]),
    validate(createJobSchema),
    catchAsyncError(JobController.createJob),
  );
router
  .route('/:jobId')
  .get(catchAsyncError(JobController.getSingleJob))
  .delete(
    AuthMiddleware.protect,
    AuthMiddleware.restrictTo([UserRoles.CLIENT, UserRoles.ADMIN]),
    // will add zod
    catchAsyncError(JobController.deleteJob),
  )
  .patch(
    AuthMiddleware.protect,
    AuthMiddleware.restrictTo([UserRoles.CLIENT, UserRoles.ADMIN]),
    // will add zod
    catchAsyncError(JobController.updateJob),
  );

export default router;
