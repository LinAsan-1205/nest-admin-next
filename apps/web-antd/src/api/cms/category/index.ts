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

/**
 * 修改部门状态
 * @param data
 */
export function changeStatus(data: CategoryApi.ChangeStatus) {
  return requestClient.post<boolean>('/cms/category/changeStatus', data);
}

export { type CategoryApi };
