import { Router } from 'express';
import AuthMiddleware from '@/middlewares/Auth.middleware';
import { UserRoles } from '@/interfaces/IUser';
import CompanyController from '@/controllers/Company.controller';
import validate from '@/middlewares/validate';
import { clientSchema } from '@/schemas/ClientSchema';

const router: Router = Router();

router
  .route('/')
  .post(
    AuthMiddleware.protect,
    AuthMiddleware.restrictTo([UserRoles.FREELANCER]),
    validate(clientSchema),
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
  '/:requestId/approve',
  AuthMiddleware.protect,
  AuthMiddleware.restrictTo([UserRoles.ADMIN]),
  CompanyController.approveClientRequest,
);

router.patch(
  '/:requestId/reject',
  AuthMiddleware.protect,
  AuthMiddleware.restrictTo([UserRoles.ADMIN]),
  CompanyController.rejectClientRequest,
);

export default router;
