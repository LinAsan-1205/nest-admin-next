<script lang="ts" setup>
import type { VbenFormProps, VxeGridProps } from '#/adapter';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter';
import { changeStatus, type DeptApi, getDeptList } from '#/api/system/dept';

import DeptFormModel from './components/FormModel.vue';

interface RowType extends DeptApi.Item {}

const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'deptName',
      label: $t('page.dept.deptName'),
    },
    {
      component: 'Input',
      fieldName: 'leader',
      label: $t('page.dept.leader'),
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: '正常',
            value: '0',
          },
          {
            label: '停用',
            value: '1',
          },
        ],
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: $t('page.dept.status'),
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'deptName',
      title: $t('page.dept.deptName'),
      treeNode: true,
      minWidth: 100,
    },
    {
      field: 'leader',
      title: $t('page.dept.leader'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'email',
      title: $t('page.dept.email'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'phone',
      title: $t('page.dept.phone'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'status',
      title: $t('page.dept.status'),
      slots: { default: 'status' },
      minWidth: 100,
    },
    { field: 'orderNum', title: $t('page.dept.orderNum'), minWidth: 100 },
    { slots: { default: 'action' }, title: '操作', minWidth: 100 },
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

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: DeptFormModel,
});

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

const onCreate = (parentId?: string) => {
  formModalApi.setState({ title: $t('page.dept.createDept') });
  formModalApi.setData({
    values: {
      parentId,
    },
    update: false,
  });
  formModalApi.open();
};

const actionList = [
  {
    title: '编辑',
    onClick: (_: RowType) => {
      // onUpdate(row);
    },
  },
  {
    title: '新增',
    onClick: (row: RowType) => {
      onCreate(row.deptId);
    },
  },
  {
    title: '删除',
    danger: true,
    onClick: (_: RowType) => {
      // onRemove([row]);
    },
  },
];
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
      <template #action="{ row }">
        <Action :list="actionList" :row="row" />
      </template>
    </Grid>
    <FormModal @refresh="refreshTable" />
  </Page>
</template>
