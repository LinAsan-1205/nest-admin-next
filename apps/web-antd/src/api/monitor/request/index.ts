import { requestClient } from '#/api/core/request';

import { type RequestLogApi } from './model';

/**
 * 获取请求日志
 * @param params
 */
export function getRequestList(params?: RequestLogApi.ListParams) {
  return requestClient.get<RequestLogApi.List>('/request/log', { params });
}

export function deleteRequest(ids: string) {
  return requestClient.delete<boolean>(`/request/log/${ids}`);
}

export { type RequestLogApi };
