import { requestClient } from '#/api/core/request';

import { type DeptApi } from './model';

/**
 * 获取部门列表
 * @param params
 */
export function getDeptList(params?: DeptApi.ListParams) {
  return requestClient.get<DeptApi.List[]>('/dept', { params });
}

/**
 * 修改部门状态
 * @param data
 */
export function changeStatus(data: DeptApi.ChangeStatus) {
  return requestClient.post<boolean>('/dept/changeStatus', data);
}

export { type DeptApi };
