import { Router } from 'express';
import AuthMiddleware from '@/middlewares/Auth.middleware';
import { UserRoles } from '@/interfaces/IUser';
import CompanyController from '@/controllers/Company.controller';

const router: Router = Router();

router
  .route('/')
  .post(
    AuthMiddleware.protect,
    AuthMiddleware.restrictTo([UserRoles.FREELANCER]),
    CompanyController.submitClientRequest,
  )
  .get(
    AuthMiddleware.protect,
    AuthMiddleware.restrictTo([UserRoles.ADMIN]),
    CompanyController.getAllRequests,
  );

router.get(
  '/:requestId',
  AuthMiddleware.protect,
  AuthMiddleware.restrictTo([UserRoles.ADMIN]),
  CompanyController.getSingleRequest,
);

router.patch(
  '/companies/:requestId/approve',
  AuthMiddleware.protect,
  AuthMiddleware.restrictTo([UserRoles.ADMIN]),
  CompanyController.approveClientRequest,
);

router.patch(
  '/companies/:requestId/reject',
  AuthMiddleware.protect,
  AuthMiddleware.restrictTo([UserRoles.ADMIN]),
  CompanyController.rejectClientRequest,
);

export default router;
