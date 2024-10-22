import { requestClient } from '#/api/core/request';

import { type RoleApi } from './model';

/**
 * 获取部门列表
 * @param params
 */
export function getRoleList(params?: RoleApi.ListParams) {
  return requestClient.get<RoleApi.List>('/role', { params });
}

export function createRole(data: RoleApi.CreateParams) {
  return requestClient.post<RoleApi.Item>('/role', data);
}

export function updateRole(id: string, data: RoleApi.CreateParams) {
  return requestClient.put<RoleApi.Item>(`/role/${id}`, data);
}

export function deleteRole(ids: string) {
  return requestClient.delete<boolean>(`/role/${ids}`);
}

/**
 * 修改部门状态
 * @param data
 */
export function changeStatus(data: RoleApi.ChangeStatus) {
  return requestClient.post<boolean>('/role/changeStatus', data);
}

export { type RoleApi };
