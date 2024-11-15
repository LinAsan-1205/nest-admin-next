import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ant-design:reconciliation-outlined',
      order: 1,
      title: $t('menu.cms.title'),
    },
    name: 'Cms',
    path: '/cms',
    children: [
      {
        name: 'CmsCategory',
        path: '/cms/category',
        component: () => import('#/views/cms/category/index.vue'),
        meta: {
          icon: 'svg:category',
          title: $t('cms_category.title'),
          order: 1,
        },
      },
    ],
  },
];

export default routes;
