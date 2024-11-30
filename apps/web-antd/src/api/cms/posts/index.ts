import type { ChangeStatus } from '#/api/types';

import { requestClient } from '#/api/core/request';

import { type PostsApi } from './model';

export function getPostsList(params?: PostsApi.ListParams) {
  return requestClient.get<PostsApi.List>('/cms/posts', { params });
}

export function createPosts(data: PostsApi.CreateParams) {
  return requestClient.post<PostsApi.View>('/cms/posts', data);
}

export function updatePosts(id: string, data: PostsApi.CreateParams) {
  return requestClient.put<PostsApi.View>(`/cms/posts/${id}`, data);
}

export function deletePosts(ids: string) {
  return requestClient.delete<boolean>(`/cms/posts/${ids}`);
}

export function changeStatus(data: ChangeStatus) {
  return requestClient.post<boolean>('/cms/posts/changeStatus', data);
}

export { type PostsApi };
