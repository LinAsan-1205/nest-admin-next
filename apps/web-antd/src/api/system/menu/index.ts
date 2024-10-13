import type { MenuApi } from './model';

import { requestClient } from '#/api/core/request';

export function getMenuList(params?: MenuApi.ListParams) {
  return requestClient.get<MenuApi.List>('/menu', { params });
}

export { type MenuApi };
