import { requestClient } from '#/api/core/request';

import { type UploadApi } from './model';

/**
 * 上传单个文件
 * @param data
 */
export async function uploadASingleFile(data: FormData) {
  return requestClient.post<UploadApi.Item>('/upload/singleFile', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export { type UploadApi };
