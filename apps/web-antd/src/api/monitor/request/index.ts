import { requestClient } from '#/api/core/request';

import { type RequestLogApi } from './model';

/**
 * 获取请求日志
 * @param params
 */
export function getRequestList(params?: RequestLogApi.ListParams) {
  return requestClient.get<RequestLogApi.List>('/request/log', { params });
}

export function clearRequestTheLog() {
  return requestClient.post<boolean>(`/request/log/clearTheLog`);
}

export { type RequestLogApi };
