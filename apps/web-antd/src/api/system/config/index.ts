import { requestClient } from '#/api/core/request';

import { type ConfigGroupModelApi } from './configGroupModel';
import { type ConfigModelApi } from './configModel';
/**
 * 获取系统配置组
 */
export function getConfigGroupList() {
  return requestClient.get<ConfigGroupModelApi.List>('config/group/list', {});
}

/**
 * 根据获取系统配置
 * @param groupId
 */
export function getConfigurationBasedOnGrouping(groupId?: string) {
  return requestClient.get<ConfigModelApi.List>(
    `config/grouping/${groupId}`,
    {},
  );
}

export { type ConfigGroupModelApi, type ConfigModelApi };
