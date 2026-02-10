import { Router } from 'express';
import { NotificationHandlers } from './notification-handler';
import { Middlewares } from '../../../shared/interface/i-middlewares';
import { catchHandler } from '../../../shared/utils/controller-util';

export const registerNotificationRoutes = (
  router: Router,
  middleware: Middlewares,
  handlers: NotificationHandlers,
) => {
  router.get('/', middleware.auth.authenticate, catchHandler(handlers.getNotifications));

  router.patch(
    '/:notificationId/read',
    middleware.auth.authenticate,
    catchHandler(handlers.markAsRead),
  );

  router.get('/sse', middleware.auth.authenticate, catchHandler(handlers.getLiveNotification));

  return { router };
};
