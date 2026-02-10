import { Router } from 'express';
import { AuthHandlers } from './auth-handler';
import { catchHandler } from '../../../shared/utils/controller-util';

export const registerAuthRoutes = (router: Router, handlers: AuthHandlers) => {
  router.post('/login', catchHandler(handlers.login));

  router.post('/logout', catchHandler(handlers.logout));

  router.post('/refresh', catchHandler(handlers.refreshToken));
};
