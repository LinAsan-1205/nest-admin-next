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
 * 创建系统配置组
 * @param data
 */
export function createConfigGroup(data: ConfigGroupModelApi.CreateParams) {
  return requestClient.post<boolean>(`config/group`, data);
}

/**
 * 更新系统配置组
 * @param groupId
 * @param data
 */
export function updateConfigGroup(
  groupId: string,
  data: ConfigGroupModelApi.UpdateParams,
) {
  return requestClient.post<boolean>(`config/group/${groupId}`, data);
}

/**
 * 获取系统配置组详情
 * @param groupId
 */
export function getConfigGroupDetail(groupId: string) {
  return requestClient.post<ConfigGroupModelApi.List>(
    `config/group/detail/${groupId}`,
  );
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

/**
 * 更新系统配置所有字段
 * @param groupId
 * @param data
 */
export function updateConfigAllFields(
  groupId: string,
  data: ConfigModelApi.UpdateAllFields,
) {
  return requestClient.post<ConfigModelApi.List>(
    `config/updateAllFields/${groupId}`,
    data,
  );
}

export { type ConfigGroupModelApi, type ConfigModelApi };
