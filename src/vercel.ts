import { createInjector } from './injector';

const { httpServer } = createInjector();

export default httpServer.app;
