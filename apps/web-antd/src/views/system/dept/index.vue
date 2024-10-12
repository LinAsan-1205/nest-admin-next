<script lang="ts" setup>
import type { VxeGridListeners, VxeGridProps } from '#/adapter';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter';
import { changeStatus, type DeptApi, getDeptList } from '#/api/system/dept';

interface RowType extends DeptApi.Item {}

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'deptName',
      title: $t('page.dept.deptName'),
      treeNode: true,
      minWidth: 100,
    },
    { field: 'leader', title: $t('page.dept.leader'), minWidth: 100 },
    { field: 'email', title: $t('page.dept.email'), minWidth: 100 },
    { field: 'phone', title: $t('page.dept.phone'), minWidth: 100 },
    {
      field: 'status',
      title: $t('page.dept.status'),
      slots: { default: 'status' },
      minWidth: 100,
    },
    { field: 'orderNum', title: $t('page.dept.orderNum'), minWidth: 100 },
  ],
  height: 'auto',
  treeConfig: {
    parentField: 'parentId',
    rowField: 'deptId',
    childrenField: 'children',
    transform: false,
  },
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        return await getDeptList({
          ...formValues,
        });
      },
    },
    response: {
      list: ({ data }) => {
        return data;
      },
    },
  },
  sortConfig: {
    multiple: true,
  },
};

const gridEvents: VxeGridListeners<RowType> = {
  cellClick: ({ row }) => {
    message.info(`cell-click: ${row.name}`);
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridEvents, gridOptions });

const refreshTable = () => {
  gridApi.reload();
};

const onChangeStatus = async (checked: string, row: RowType) => {
  try {
    await changeStatus({ status: checked, deptId: row.deptId });
    row.status = checked;
    message.success($t('page.apiSuccess'));
    refreshTable();
  } catch {
    row.status = checked === '0' ? '1' : '0';
  }
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #status="{ row }">
        <a-switch
          v-model:checked="row.status"
          checked-value="0"
          un-checked-value="1"
          @change="onChangeStatus($event, row)"
        />
      </template>
    </Grid>
  </Page>
</template>
