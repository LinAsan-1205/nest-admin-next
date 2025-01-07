import type { ChangeStatus } from '#/api/types';

import type { LinkApi } from './model';

import { requestClient } from '#/api/core/request';

export function getLinkList(params?: LinkApi.ListParams) {
  return requestClient.get<LinkApi.List>('/cms/links', { params });
}

export function createLink(data: LinkApi.FormParams) {
  return requestClient.post<LinkApi.View>('/cms/links', data);
}

export function updateLink(id: string, data: LinkApi.FormParams) {
  return requestClient.put<LinkApi.View>(`/cms/links/${id}`, data);
}

export function deleteLink(ids: string) {
  return requestClient.delete<boolean>(`/cms/links/${ids}`);
}
export function changeStatus(data: ChangeStatus) {
  return requestClient.post<boolean>('/cms/links/changeStatus', data);
}

export { type LinkApi };
