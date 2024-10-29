<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeStatus,
  deleteDept,
  type DeptApi,
  getDeptList,
} from '#/api/system/dept';

import DeptFormModel from './components/FormModel.vue';

interface RowType extends DeptApi.Item {}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'deptName',
      label: $t('dept.deptName'),
    },
    {
      component: 'Input',
      fieldName: 'leader',
      label: $t('dept.leader'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_dept_status',
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: $t('dept.status'),
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'deptName',
      title: $t('dept.deptName'),
      treeNode: true,
      minWidth: 100,
    },
    {
      field: 'leader',
      title: $t('dept.leader'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'email',
      title: $t('dept.email'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'phone',
      title: $t('dept.phone'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      cellRender: {
        name: 'switch',
        props: {
          checkedValue: '0',
          unCheckedValue: '1',
          onChangeStatus: async (checked: string, row: RowType) => {
            try {
              await changeStatus({ status: checked, deptId: row.deptId });
              row.status = checked;
              message.success($t('page.apiSuccess'));
            } catch {
              row.status = checked === '0' ? '1' : '0';
            }
          },
        },
      },
      field: 'status',
      title: $t('dept.status'),
      minWidth: 100,
    },
    { field: 'orderNum', title: $t('dept.orderNum'), minWidth: 100 },
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
    message.success($t('api.success'));
    refreshTable();
  } catch {
    row.status = checked === '0' ? '1' : '0';
  }
};

const onCreate = (parentId?: string) => {
  formModalApi.setState({ title: $t('dept.createDept') });
  formModalApi.setData({
    values: {
      parentId,
    },
    update: false,
  });
  formModalApi.open();
};

const onRemove = async (ids?: RowType[]) => {
  const records = ids || (gridApi.grid?.getCheckboxRecords() as RowType[]);
  if (records.length === 0) {
    message.error($t('dept.selectDept'));
    return;
  }
  Modal.confirm({
    title: $t('modal.confirmTitle'),
    content: $t('modal.confirmContent'),
    onOk: async () => {
      await deleteDept(records.map((item) => item.deptId).join(','));
      message.success($t('api.remove'));
      refreshTable();
    },
  });
};
const onUpdate = (row: RowType) => {
  formModalApi.setState({ title: $t('dept.updateDept') });
  formModalApi.setData({
    values: row,
    update: true,
    deptId: row.deptId,
  });
  formModalApi.open();
};

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
    title: '新增',
    onClick: (row: RowType) => {
      onCreate(row.deptId);
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
      <template #status="{ row }">
        <a-switch
          v-model:checked="row.status"
          checked-value="0"
          un-checked-value="1"
          @change="onChangeStatus($event, row)"
        />
      </template>
      <template #action="{ row }">
        <TableAction :list="actionList" :row="row" />
      </template>
      <template #toolbar-actions>
        <TableAction :list="toolbarActionList" type="toolbar" />
      </template>
    </Grid>
    <FormModal @refresh="refreshTable" />
  </Page>
</template>
