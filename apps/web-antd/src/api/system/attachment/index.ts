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

export function createClassify(data: ClassifyApi.FormModelParams) {
  return requestClient.post<boolean>('/attachment/classify', data);
}

export function updateClassify(id: string, data: ClassifyApi.FormModelParams) {
  return requestClient.put<boolean>(`/attachment/classify/${id}`, data);
}

export function deleteClassify(ids: string) {
  return requestClient.post<boolean>(`/attachment/classify/${ids}`);
}

export { type AttachmentApi, type ClassifyApi };
