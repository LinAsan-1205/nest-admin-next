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
      {
        name: 'CmsPosts',
        path: '/cms/posts',
        component: () => import('#/views/cms/posts/index.vue'),
        meta: {
          icon: 'ant-design:snippets-outlined',
          title: $t('cms_posts.menu_title'),
          order: 2,
        },
      },
      {
        name: 'CmsPostsCreate',
        path: '/cms/posts/create',
        component: () => import('#/views/cms/posts/form.vue'),
        meta: {
          icon: 'ant-design:form-outlined',
          title: $t('cms_posts.create_title'),
          order: 3,
          hideInMenu: true,
        },
      },
      {
        name: 'CmsTag',
        path: '/cms/tag',
        component: () => import('#/views/cms/tag/index.vue'),
        meta: {
          icon: 'ant-design:tag-outlined',
          title: $t('cms_tag.title'),
          order: 99,
        },
      },
      {
        name: 'CmsLink',
        path: '/cms/link',
        component: () => import('#/views/cms/links/index.vue'),
        meta: {
          icon: 'ant-design:paper-clip-outlined',
          title: $t('cms_link.title'),
          order: 99,
        },
      },
    ],
  },
];

export default routes;
