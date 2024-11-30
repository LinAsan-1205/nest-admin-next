<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeStatus,
  deletePosts,
  getPostsList,
  type PostsApi,
} from '#/api/cms/posts';
import { router } from '#/router';

interface RowType extends PostsApi.View {}

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'title',
      label: $t('cms_posts.title'),
    },

    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_status',
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: $t('cms_posts.status'),
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'title',
      title: $t('cms_posts.title'),
      minWidth: 100,
    },

    {
      field: 'alias',
      title: $t('cms_posts.alias'),
      minWidth: 100,
    },
    {
      cellRender: {
        name: 'DictTag',
        props: {
          dictType: 'posts_commentsAreAllowed',
        },
      },
      field: 'commentsAreAllowed',
      title: $t('cms_posts.commentsAreAllowed'),
      minWidth: 100,
    },
    {
      cellRender: {
        name: 'DictTag',
        props: {
          dictType: 'posts_pinnedOrNot',
        },
      },
      field: 'pinnedOrNot',
      title: $t('cms_posts.pinnedOrNot'),
      minWidth: 100,
    },
    {
      cellRender: {
        name: 'DictTag',
        props: {
          dictType: 'posts_template',
        },
      },
      field: 'template',
      title: $t('cms_posts.template'),
      minWidth: 100,
    },

    { field: 'likeCount', title: $t('cms_posts.likeCount'), minWidth: 100 },
    { field: 'shareCount', title: $t('cms_posts.shareCount'), minWidth: 100 },
    {
      cellRender: {
        name: 'switch',
        props: {
          checkedValue: '0',
          unCheckedValue: '1',
          onChangeStatus: async (checked: string, row: RowType) => {
            try {
              await changeStatus({
                status: checked,
                id: row.postsId,
              });
              row.status = checked;
              message.success($t('api.success'));
            } catch {
              row.status = checked === '0' ? '1' : '0';
            }
          },
        },
      },
      field: 'status',
      title: $t('cms_category.status'),
      minWidth: 100,
    },
    {
      field: 'publicationTime',
      title: $t('cms_posts.publicationTime'),
      formatter: 'formatDateTime',
      minWidth: 100,
    },
    { slots: { default: 'action' }, title: '操作', minWidth: 100 },
  ],
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        return await getPostsList({
          ...formValues,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const refreshTable = () => {
  gridApi.reload();
};

const onCreate = () => {
  router.push({ path: '/cms/posts/create' });
};

const onRemove = async (ids?: RowType[]) => {
  const records = ids || (gridApi.grid?.getCheckboxRecords() as RowType[]);
  if (records.length === 0) {
    message.error($t('cms_category.selectCategory'));
    return;
  }
  Modal.confirm({
    title: $t('modal.confirmTitle'),
    content: $t('modal.confirmContent'),
    onOk: async () => {
      await deletePosts(records.map((item) => item.postsId).join(','));
      message.success($t('api.remove'));
      refreshTable();
    },
  });
};
const onUpdate = () => {};

const toolbarActionList = [
  {
    title: '新增',
    type: 'primary',
    onClick: () => {
      onCreate();
    },
  },
  {
    title: '删除',
    type: 'primary',
    danger: true,
    onClick: () => {
      onRemove();
    },
  },
];

const actionList = [
  {
    title: '编辑',
    onClick: (row: RowType) => {
      onUpdate(row);
    },
  },
  {
    title: '删除',
    danger: true,
    onClick: (row: RowType) => {
      onRemove([row]);
    },
  },
];
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #action="{ row }">
        <TableAction :list="actionList" :row="row" />
      </template>
      <template #toolbar-actions>
        <TableAction :list="toolbarActionList" type="toolbar" />
      </template>
    </Grid>
  </Page>
</template>
