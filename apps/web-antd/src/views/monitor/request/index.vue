<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  clearRequestTheLog,
  getRequestList,
  type RequestLogApi,
} from '#/api/monitor/request';

interface RowType extends RequestLogApi.Item {}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'url',
      label: $t('log.requestLog.url'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_request_method',
        placeholder: '请选择请求类型',
      },
      fieldName: 'method',
      label: $t('log.requestLog.method'),
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'userId',
      title: $t('log.requestLog.userId'),
      formatter: 'formatEmpty',
    },
    {
      field: 'users.nickName',
      title: $t('log.requestLog.nickName'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'url',
      title: $t('log.requestLog.url'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'method',
      title: $t('log.requestLog.method'),
      treeNode: true,
      minWidth: 100,
    },
    {
      field: 'params',
      title: $t('log.requestLog.params'),
      minWidth: 100,
    },
    {
      field: 'ip',
      title: $t('log.requestLog.ip'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'createTime',
      title: $t('log.requestLog.createTime'),
      formatter: 'formatDateTime',
      minWidth: 156,
    },
  ],
  height: 'auto',
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getRequestList({
          ...formValues,
          page: page.currentPage,
          pageSize: page.pageSize,
        });
      },
    },
  },
  sortConfig: {
    multiple: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const refreshTable = () => {
  gridApi.reload();
};

const onRemove = async () => {
  Modal.confirm({
    title: $t('modal.confirmTitle'),
    content: $t('modal.confirmContent'),
    onOk: async () => {
      await clearRequestTheLog();
      message.success($t('api.remove'));
      refreshTable();
    },
  });
};

const toolbarActionList = [
  {
    title: '清空日志',
    type: 'primary',
    danger: true,
    onClick: () => {
      onRemove();
    },
  },
];
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <TableAction :list="toolbarActionList" type="toolbar" />
      </template>
    </Grid>
  </Page>
</template>
