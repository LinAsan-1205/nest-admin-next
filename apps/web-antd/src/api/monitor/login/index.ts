import { requestClient } from '#/api/core/request';

import { type LoginLogApi } from './model';

/**
 * 获取登录日志
 * @param params
 */
export function getLoginLogList(params?: LoginLogApi.ListParams) {
  return requestClient.get<LoginLogApi.List>('/login/log', { params });
}

export function clearLoginLogTheLog() {
  return requestClient.post<boolean>(`/login/log/clearTheLog`);
}

export { type LoginLogApi };
