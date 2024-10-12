import type { DictTypeApi } from '#/api/system/dict/dictModel.ts';

import { requestClient } from '#/api/core/request';

/**
 * 获取字典类型列表
 * @param params
 */
export function getDictTypeList(params?: DictTypeApi.ListParams) {
  return requestClient.get<DictTypeApi.List>('/dictType', { params });
}

/**
 * 创建字典类型
 * @param data
 */
export function createDictType(data: DictTypeApi.FormModelParams) {
  return requestClient.post<DictTypeApi.Item>('/dictType', data);
}

/**
 * 更新字典类型
 * @param id
 * @param data
 */
export function updateDictType(id: string, data: DictTypeApi.FormModelParams) {
  return requestClient.put<DictTypeApi.Item>(`/dictType/${id}`, data);
}

export function deleteDictType(id: string) {
  return requestClient.delete<boolean>(`/dictType/${id}`);
}
export { type DictTypeApi };
