import { requestClient } from '#/api/core/request';

import { type UserApi } from './model';
/**
 * 账号登录接口
 */
export async function getProfile() {
  return requestClient.get<UserApi.Profile>('/users/profile');
}

export async function getList(params: UserApi.ListParams) {
  return requestClient.get<UserApi.List>('/users', { params });
}
