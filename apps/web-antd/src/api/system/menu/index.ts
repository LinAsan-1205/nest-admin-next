import type { MenuApi } from './model';

import { requestClient } from '#/api/core/request';

export function getMenuList(params?: MenuApi.ListParams) {
  return requestClient.get<MenuApi.List>('/menu', { params });
}

export function createMenu(data: MenuApi.FormModelParams) {
  return requestClient.post<boolean>('/menu', data);
}

export function updateMenu(id: string, data: MenuApi.FormModelParams) {
  return requestClient.put<boolean>(`/menu/${id}`, data);
}

export function deleteMenu(ids: string) {
  return requestClient.delete<boolean>(`/menu/${ids}`);
}

export function changeStatus(data: MenuApi.ChangeStatusParams) {
  return requestClient.post<boolean>('/menu/changeStatus', data);
}

export { type MenuApi };
