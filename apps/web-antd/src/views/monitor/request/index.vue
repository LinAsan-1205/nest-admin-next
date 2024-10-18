<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getRequestList } from '#/api/monitor/request';

interface RowType extends DeptApi.Item {}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'url',
      label: $t('page.requestLog.url'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_request_method',
        placeholder: '请选择请求类型',
      },
      fieldName: 'method',
      label: $t('page.requestLog.method'),
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'userId',
      title: $t('page.requestLog.userId'),
      formatter: 'formatEmpty',
    },
    {
      field: 'users.nickName',
      title: $t('page.requestLog.nickName'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'url',
      title: $t('page.requestLog.url'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'method',
      title: $t('page.requestLog.method'),
      treeNode: true,
      minWidth: 100,
    },
    {
      field: 'params',
      title: $t('page.requestLog.params'),
      minWidth: 100,
    },
    {
      field: 'ip',
      title: $t('page.requestLog.ip'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'createTime',
      title: $t('page.requestLog.createTime'),
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

const onRemove = async (ids?: RowType[]) => {
  const records = ids || (gridApi.grid?.getCheckboxRecords() as RowType[]);
  if (records.length === 0) {
    message.error($t('page.dept.selectDept'));
    return;
  }
  Modal.confirm({
    title: $t('page.modal.confirmTitle'),
    content: $t('page.modal.confirmContent'),
    onOk: async () => {
      await deleteDept(records.map((item) => item.deptId).join(','));
      message.success($t('page.apiRemove'));
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
