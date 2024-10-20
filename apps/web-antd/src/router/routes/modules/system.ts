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
        name: 'Role',
        path: '/system/role',
        component: () => import('#/views/system/role/index.vue'),
        meta: {
          icon: 'ant-design:team-outlined',
          title: $t('menu.role.title'),
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
      {
        name: 'Menu',
        path: '/system/menu',
        component: () => import('#/views/system/menu/index.vue'),
        meta: {
          icon: 'ant-design:menu-outlined',
          title: $t('menu.menu.title'),
        },
      },
      {
        name: 'Dict',
        path: '/system/dict',
        component: () => import('#/views/system/dict/index.vue'),
        meta: {
          icon: 'ant-design:database-outlined',
          title: $t('menu.dict.title'),
        },
      },
      {
        name: 'Attachment',
        path: '/system/attachment',
        component: () => import('#/views/system/attachment/index.vue'),
        meta: {
          icon: 'ant-design:file-text-outlined',
          title: $t('menu.attachment.title'),
        },
      },
      {
        name: 'Config',
        path: '/system/config',
        component: () => import('#/views/system/config/index.vue'),
        meta: {
          icon: 'ant-design:setting-outlined',
          title: $t('menu.config.title'),
        },
      },
    ],
  },
];

export default routes;
