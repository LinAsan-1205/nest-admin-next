import { requestClient } from '#/api/core/request';

import { type DeptApi } from './model';
/**
 * 获取部门列表
 * @param params
 */
export async function getDeptList(params: DeptApi.ListParams) {
  return requestClient.get<DeptApi.List[]>('/dept', { params });
}

export { type DeptApi };
