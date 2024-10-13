import type { MenuApi } from './model';

import { requestClient } from '#/api/core/request';

export function getMenuList(params?: MenuApi.ListParams) {
  return requestClient.get<MenuApi.List>('/menu', { params });
}

export function createMenu(data: MenuApi.FormModelParams) {
  return requestClient.post<boolean>('/menu', data);
}

export function updateMenu(id: string, data: MenuApi.FormModelParams) {
  return requestClient.put<boolean>(`/dept/${id}`, data);
}

export { type MenuApi };
