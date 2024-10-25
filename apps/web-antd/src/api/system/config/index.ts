import { requestClient } from '#/api/core/request';

import { type ConfigGroupModelApi } from './configGroupModel';

/**
 * 获取系统配置组
 */
export function getConfigGroupList() {
  return requestClient.get<ConfigGroupModelApi.List>('config/group/list', {});
}

export { type ConfigGroupModelApi };
