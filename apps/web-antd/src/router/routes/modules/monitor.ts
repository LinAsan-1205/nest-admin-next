import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ant-design:fund-projection-screen-outlined',
      order: 98,
      title: $t('menu.monitor.title'),
    },
    name: 'Monitor',
    path: '/monitor',
    children: [
      {
        name: 'Request',
        path: '/monitor/request',
        component: () => import('#/views/monitor/request/index.vue'),
        meta: {
          icon: 'ant-design:file-outlined',
          title: $t('menu.request.title'),
        },
      },
      {
        name: 'LoginLog',
        path: '/monitor/login-log',
        component: () => import('#/views/monitor/login/index.vue'),
        meta: {
          icon: 'ant-design:file-outlined',
          title: $t('menu.login.title'),
        },
      },
    ],
  },
];

export default routes;
