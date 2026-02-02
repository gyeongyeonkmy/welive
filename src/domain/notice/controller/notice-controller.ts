import { NoticeCommandService } from '../service/notice-command';
import { NoticeQueryService } from '../service/notice-query';
import { Middlewares } from '../../../shared/interface/i-middlewares';
import { createNoticeHandler } from './notice-handler';
import { registerNoticeRoutes } from './notice-router';
import { createBaseController } from '../../../shared/utils/controller-util';

export const createNoticeController = (
  middlewares: Middlewares,
  noticeQueryService: NoticeQueryService,
  noticeCommandService: NoticeCommandService,
) => {
  const { basePath, router } = createBaseController('/api/v2');

  const handler = createNoticeHandler(middlewares, noticeQueryService, noticeCommandService);

  registerNoticeRoutes(router, handler, middlewares);

  return { basePath, router };
};

export type NoticeController = ReturnType<typeof createNoticeController>;
