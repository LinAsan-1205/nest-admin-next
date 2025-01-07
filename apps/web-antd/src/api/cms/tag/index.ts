import type { ChangeStatus } from '#/api/types';

import type { TagApi } from './model';

import { requestClient } from '#/api/core/request';

export function getTagList(params?: TagApi.ListParams) {
  return requestClient.get<TagApi.List>('/cms/tags', { params });
}

export function createTag(data: TagApi.FormParams) {
  return requestClient.post<TagApi.View>('/cms/tags', data);
}

export function updateTag(id: string, data: TagApi.FormParams) {
  return requestClient.put<TagApi.View>(`/cms/tags/${id}`, data);
}

export function deleteTag(ids: string) {
  return requestClient.delete<boolean>(`/cms/tags/${ids}`);
}
export function changeStatus(data: ChangeStatus) {
  return requestClient.post<boolean>('/cms/tags/changeStatus', data);
}

export { type TagApi };
