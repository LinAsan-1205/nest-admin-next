<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref, watch } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeStatus,
  deleteUser,
  getList,
  type UserApi,
} from '#/api/system/user';
import { $t } from '#/locales';

import DeptThree from './components/DeptThree.vue';
import UserFormModel from './components/FormModel.vue';

interface RowType extends UserApi.Item {}

const deptId = ref<null | string>(null);
const deptSearchValue = ref<null | string>(null);

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'userName',
      label: $t('users.userName'),
    },
    {
      component: 'Input',
      fieldName: 'nickName',
      label: $t('users.nickName'),
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('users.phone'),
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('users.email'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_user_status',
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: $t('users.status'),
    },
    {
      component: 'RangePicker',
      fieldName: 'registeredTime',
      label: $t('users.createTime'),
      componentProps: {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    checkMethod: ({ row }) => {
      return !row.userTypeDisable;
    },
  },
  columns: [
    { type: 'checkbox', width: 50 },
    {
      field: 'avatar',
      title: $t('users.avatar'),
      slots: { default: 'avatar' },
      minWidth: 100,
    },
    { field: 'userName', title: $t('users.userName'), minWidth: 100 },
    {
      field: 'nickName',
      title: $t('users.nickName'),
      formatter: 'formatEmpty',
      minWidth: 100,
    },
    {
      field: 'dept.deptName',
      title: $t('users.deptName'),
      formatter: 'formatEmpty',
      minWidth: 100,
    },
    {
      field: 'phone',
      title: $t('users.phone'),
      formatter: 'formatEmpty',
      minWidth: 100,
    },
    {
      field: 'email',
      title: $t('users.email'),
      formatter: 'formatEmpty',
      minWidth: 150,
    },
    {
      cellRender: {
        name: 'switch',
        props: {
          checkedValue: '0',
          unCheckedValue: '1',
          disabledValue: (row: RowType) => {
            return row.userTypeDisable;
          },
          onChangeStatus: async (checked: string, row: RowType) => {
            if (row.userTypeDisable) {
              message.error('该用户为系统内置用户，不允许操作');
              return;
            }
            try {
              await changeStatus({ status: checked, id: row.userId });
              row.status = checked;
              message.success($t('api.success'));
            } catch {
              row.status = checked === '0' ? '1' : '0';
            }
          },
        },
      },
      field: 'status',
      title: $t('users.status'),
      minWidth: 100,
    },
    {
      field: 'loginIp',
      title: $t('users.loginIp'),
      formatter: 'formatEmpty',
      minWidth: 156,
    },
    {
      field: 'loginDate',
      title: $t('users.loginDate'),
      minWidth: 156,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '从未登录过';
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      field: 'createTime',
      title: $t('users.createTime'),
      formatter: 'formatDateTime',
      minWidth: 156,
    },
    {
      slots: { default: 'action' },
      fixed: 'right',
      title: '操作',
      minWidth: 100,
    },
  ],
  height: 'auto',
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
          deptId: deptId.value,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: UserFormModel,
});

const refreshTable = () => {
  gridApi.reload();
};

const onCreate = () => {
  formModalApi.setState({ title: $t('users.createUser') });
  formModalApi.setData({
    update: false,
  });
  formModalApi.open();
};

const onUpdate = (row: RowType) => {
  formModalApi.setState({ title: $t('users.editUser') });
  formModalApi.setData({
    values: { ...row },
    update: true,
    userId: row.userId,
  });
  formModalApi.open();
};

const onRemove = async (ids?: RowType[]) => {
  const records = ids || (gridApi.grid?.getCheckboxRecords() as RowType[]);
  if (records.length === 0) {
    message.error($t('users.selectUser'));
    return;
  }
  Modal.confirm({
    title: $t('modal.confirmTitle'),
    content: $t('modal.confirmContent'),
    onOk: async () => {
      await deleteUser(records.map((item) => item.userId).join(','));
      message.success($t('api.remove'));
      refreshTable();
    },
  });
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
    title: '删除',
    danger: true,
    onClick: (row: RowType) => {
      onRemove([row]);
    },
  },
];

watch(deptId, () => {
  refreshTable();
});
</script>

<template>
  <Page auto-content-height>
    <div class="h-full md:flex md:justify-between md:gap-4">
      <DeptThree v-model="deptId" v-model:search-value="deptSearchValue" />
      <Grid class="flex-1 md:w-[calc(100%-250px)]">
        <template #toolbar-actions>
          <TableAction :list="toolbarActionList" type="toolbar" />
        </template>
        <template #avatar="{ row }">
          <a-avatar :src="row.avatar" />
        </template>
        <template #action="{ row }">
          <template v-if="!row.userTypeDisable">
            <TableAction :list="actionList" :row="row" />
          </template>
        </template>
      </Grid>
    </div>
    <FormModal @refresh="refreshTable" />
  </Page>
</template>
