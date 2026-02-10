import { Router } from 'express';
import { ComplaintHanders } from './complaint-handler';
import { Middlewares } from '../../../shared/interface/i-middlewares';
import { catchHandler } from '../../../shared/utils/controller-util';

export const registerComplaintRouters = (
  router: Router,
  middlewares: Middlewares,
  handlers: ComplaintHanders,
) => {
  router.get(
    '/:complaintId',
    catchHandler(middlewares.auth.authenticate),
    catchHandler(handlers.getComplaint),
  );

  router.get(
    '/',
    catchHandler(middlewares.auth.authenticate),
    catchHandler(handlers.getAllComplaints),
  );

  router.post(
    '/',
    catchHandler(middlewares.auth.authenticate),
    catchHandler(handlers.createComplaint),
  );

  router.patch(
    '/:complaintId',
    catchHandler(middlewares.auth.authenticate),
    catchHandler(handlers.updateComplaint),
  );

  router.delete(
    '/:complaintId',
    catchHandler(middlewares.auth.authenticate),
    catchHandler(handlers.deleteComplaint),
  );

  router.patch(
    '/:complaintId/status',
    catchHandler(middlewares.auth.authAdmin),
    catchHandler(handlers.updateComplaintStatus),
  );
};
