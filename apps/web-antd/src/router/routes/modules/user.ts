import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      hideChildrenInMenu: true,
      hideInMenu: true,
      icon: 'ant-design:user-outlined',
      keepAlive: true,
      order: 1000,
      title: $t('page.users.profile'),
    },
    name: 'Account',
    path: '/account/settings',
    children: [
      {
        meta: {
          title: $t('page.users.profile'),
        },
        name: 'AccountSettings',
        path: '/account/settings',
        component: () => import('#/views/system/users/profile/index.vue'),
      },
    ],
  },
];

export default routes;
