import { Router } from 'express';
import { ApartmentHandlers } from './apartment-handler';
import { catchHandler } from '../../../shared/utils/controller-util';

export const registerApartmentRoutes = (router: Router, handlers: ApartmentHandlers) => {
  router.get('/', catchHandler(handlers.getApartments));

  router.get('/:apartmentId', catchHandler(handlers.getApartment));

  return { router };
};
