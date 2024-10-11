import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'icon-park-outline:system',
      order: -1,
      title: $t('menu.system.title'),
    },
    name: 'System',
    path: '/system',
    children: [
      {
        name: 'Users',
        path: '/system/users',
        component: () => import('#/views/system/users/index.vue'),
        meta: {
          icon: 'ant-design:user-outlined',
          title: $t('menu.users.title'),
        },
      },
      {
        name: 'Dept',
        path: '/system/dept',
        component: () => import('#/views/system/dept/index.vue'),
        meta: {
          icon: 'ant-design:deployment-unit-outlined',
          title: $t('menu.dept.title'),
        },
      },
    ],
  },
];

export default routes;
