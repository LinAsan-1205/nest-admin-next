import type { DictDataApi } from '#/api/system/dict/dictDataModel.ts';

import { requestClient } from '#/api/core/request';

/**
 * 获取字典数据列表
 * @param params
 */
export function getDictDataList(params?: DictDataApi.ListParams) {
  return requestClient.get<DictDataApi.List>('/dictData', { params });
}

/**
 * 创建字典类型
 * @param data
 */
export function createDictData(data: DictDataApi.FormModelParams) {
  return requestClient.post<DictDataApi.Item>('/dictData', data);
}

/**
 * 更新字典类型
 * @param id
 * @param data
 */
export function updateDictData(id: string, data: DictDataApi.FormModelParams) {
  return requestClient.put<DictDataApi.Item>(`/dictData/${id}`, data);
}

/**
 * 更新字典类型状态
 * @param data
 */
export function changeStatus(data: DictDataApi.ChangeStatusParams) {
  return requestClient.post<boolean>('/dictData/changeStatus', data);
}

/**
 * 删除字典类型
 * @param id
 */
export function deleteDictData(id: string) {
  return requestClient.delete<boolean>(`/dictData/${id}`);
}

export { type DictDataApi };
