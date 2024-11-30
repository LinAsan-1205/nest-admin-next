import type { ChangeStatus } from '#/api/types';

import { requestClient } from '#/api/core/request';

import { type CategoryApi } from './model';

/**
 * 获取分类列表
 * @param params
 */
export function getCategoryList(params?: CategoryApi.ListParams) {
  return requestClient.get<CategoryApi.List>('/cms/category', { params });
}

export function createCategory(data: CategoryApi.CreateParams) {
  return requestClient.post<CategoryApi.Item>('/cms/category', data);
}

export function updateCategory(id: string, data: CategoryApi.CreateParams) {
  return requestClient.put<CategoryApi.Item>(`/cms/category/${id}`, data);
}

export function deleteCategory(ids: string) {
  return requestClient.delete<boolean>(`/cms/category/${ids}`);
}

export function queryAllList() {
  return requestClient.get<CategoryApi.List>('/cms/category/all');
}

export function changeStatus(data: ChangeStatus) {
  return requestClient.post<boolean>('/cms/category/changeStatus', data);
}

export { type CategoryApi };
