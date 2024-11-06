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

/**
 * 创建用户
 * @param data
 */
export async function createUser(data: UserApi.CreateParams) {
  return requestClient.post('/users', data);
}

/**
 * 更新用户
 * @param id
 * @param data
 */
export async function updateUser(id: string, data: UserApi.UpdateParams) {
  return requestClient.put(`/users/${id}`, data);
}

/**
 * 删除用户
 * @param ids
 */
export async function deleteUser(ids: string) {
  return requestClient.delete(`/users/${ids}`);
}

export async function updateBasicInformation(
  data: UserApi.BasicInformationParams,
) {
  return requestClient.put('/users/basic/information', data);
}

export { type UserApi };
