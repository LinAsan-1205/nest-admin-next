import { requestClient } from '#/api/core/request';

import { type UserApi } from './model';
/**
 * 账号登录接口
 */
export async function getProfile() {
  return requestClient.get<UserApi.Profile>('/users/profile');
}

/**
 * 获取用户列表
 * @param params
 */
export async function getList(params: UserApi.ListParams) {
  return requestClient.get<UserApi.List>('/users', { params });
}

/**
 * 修改用户状态
 * @param data
 */
export async function changeStatus(data: UserApi.ChangeStatus) {
  return requestClient.post('/users/changeStatus', data);
}

export { type UserApi };
