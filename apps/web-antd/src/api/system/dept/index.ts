import { requestClient } from '#/api/core/request';

import { type DeptApi } from './model';

/**
 * 获取部门列表
 * @param params
 */
export function getDeptList(params?: DeptApi.ListParams) {
  return requestClient.get<DeptApi.List[]>('/dept', { params });
}

export function createDept(data: DeptApi.CreateParams) {
  return requestClient.post<DeptApi.Item>('/dept', data);
}

export function updateDept(id: string, data: DeptApi.CreateParams) {
  return requestClient.put<DeptApi.Item>(`/dept/${id}`, data);
}

export function deleteDept(ids: string) {
  return requestClient.delete<boolean>(`/dept/${ids}`);
}

/**
 * 修改部门状态
 * @param data
 */
export function changeStatus(data: DeptApi.ChangeStatus) {
  return requestClient.post<boolean>('/dept/changeStatus', data);
}

export { type DeptApi };
