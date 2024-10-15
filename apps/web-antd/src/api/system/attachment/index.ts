import type { AttachmentApi, ClassifyApi } from './model';

import { requestClient } from '#/api/core/request';

export function getClassifyList(params?: ClassifyApi.SearchParams) {
  return requestClient.get<ClassifyApi.List>('/attachment/classify', {
    params,
  });
}

export function getAttachmentList(params?: AttachmentApi.SearchParams) {
  return requestClient.get<AttachmentApi.List>('/attachment', {
    params,
  });
}

export { type AttachmentApi, type ClassifyApi };
