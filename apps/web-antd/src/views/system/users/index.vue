<script lang="ts" setup>
import type { VbenFormProps, VxeGridProps } from '#/adapter';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message, Modal } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter';
import { type DeptApi, getDeptList } from '#/api/system/dept';
import {
  changeStatus,
  deleteUser,
  getList,
  type UserApi,
} from '#/api/system/user';
import { $t } from '#/locales';

import UserFormModel from './components/FormModel.vue';

interface RowType extends UserApi.List {}

const deptList = ref<DeptApi.List[]>([]);
const deptId = ref<null | string>(null);

const formOptions: VbenFormProps = {
  schema: [
    {
      component: 'Input',
      fieldName: 'userName',
      label: $t('page.users.userName'),
    },
    {
      component: 'Input',
      fieldName: 'nickName',
      label: $t('page.users.nickName'),
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: $t('page.users.phone'),
    },
    {
      component: 'Input',
      fieldName: 'email',
      label: $t('page.users.email'),
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
      label: $t('page.users.status'),
    },
    {
      component: 'RangePicker',
      fieldName: 'registeredTime',
      label: $t('page.users.createTime'),
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
      title: $t('page.users.avatar'),
      slots: { default: 'avatar' },
      minWidth: 100,
    },
    { field: 'userName', title: $t('page.users.userName'), minWidth: 100 },
    {
      field: 'nickName',
      title: $t('page.users.nickName'),
      formatter: 'formatEmpty',
      minWidth: 100,
    },
    {
      field: 'dept.deptName',
      title: $t('page.users.deptName'),
      formatter: 'formatEmpty',
      minWidth: 100,
    },
    {
      field: 'phone',
      title: $t('page.users.phone'),
      formatter: 'formatEmpty',
      minWidth: 100,
    },
    {
      field: 'email',
      title: $t('page.users.email'),
      formatter: 'formatEmpty',
      minWidth: 150,
    },
    {
      field: 'status',
      title: $t('page.users.status'),
      slots: { default: 'status' },
      minWidth: 100,
    },
    {
      field: 'loginIp',
      title: $t('page.users.loginIp'),
      formatter: 'formatEmpty',
      minWidth: 156,
    },
    {
      field: 'loginDate',
      title: $t('page.users.loginDate'),
      minWidth: 156,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '从未登录过';
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      field: 'createTime',
      title: $t('page.users.createTime'),
      formatter: 'formatDateTime',
      minWidth: 156,
    },
    { slots: { default: 'action' }, title: '操作', minWidth: 100 },
  ],
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

const onChangeStatus = async (checked: string, row: RowType) => {
  if (row.userTypeDisable) {
    message.error('该用户为系统内置用户，不允许操作');
    return;
  }
  try {
    await changeStatus({ status: checked, id: row.userId });
    row.status = checked;
    message.success($t('page.apiSuccess'));
    refreshTable();
  } catch {
    row.status = checked === '0' ? '1' : '0';
  }
};

const onTreeSelect = (selectedKeys: string[]) => {
  deptId.value = selectedKeys[0] || null;
  refreshTable();
};

const onCreate = () => {
  formModalApi.setState({ title: $t('page.users.createUser') });
  formModalApi.setData({
    update: false,
  });
  formModalApi.open();
};

const onUpdate = (row: RowType) => {
  formModalApi.setState({ title: $t('page.users.editUser') });
  formModalApi.setData({
    values: { ...row },
    update: true,
    userId: row.userId,
  });
  formModalApi.open();
};

const onRemove = async (ids: RowType[]) => {
  const records = ids || (gridApi.grid?.getCheckboxRecords() as RowType[]);
  if (records.length === 0) {
    message.error($t('page.users.selectUser'));
    return;
  }
  Modal.confirm({
    title: $t('page.modal.confirmTitle'),
    content: $t('page.modal.confirmContent'),
    onOk: async () => {
      await deleteUser(records.map((item) => item.userId).join(','));
      message.success($t('page.apiRemove'));
      refreshTable();
    },
  });
};

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

onMounted(async () => {
  await getDeptList({ status: '0' }).then((res) => {
    deptList.value = res;
  });
});
</script>

<template>
  <Page>
    <div class="md:flex md:justify-between md:gap-4">
      <a-card :bordered="false" class="mb-4 flex-none md:mb-0 md:w-[250px]">
        <a-tree
          v-if="deptList.length > 0"
          :field-names="{
            title: 'deptName',
            key: 'deptId',
            children: 'children',
          }"
          :tree-data="deptList"
          block-node
          default-expand-all
          @select="onTreeSelect"
        />
      </a-card>
      <Grid class="flex-1">
        <template #toolbar-actions>
          <a-space>
            <a-button type="primary" @click="onCreate">新增</a-button>
            <a-button danger type="primary" @click="onRemove([])">
              删除
            </a-button>
          </a-space>
        </template>
        <template #avatar="{ row }">
          <a-avatar :src="row.avatar" />
        </template>
        <template #status="{ row }">
          <a-switch
            v-model:checked="row.status"
            :disabled="row.userTypeDisable"
            checked-value="0"
            un-checked-value="1"
            @change="onChangeStatus($event, row)"
          />
        </template>
        <template #action="{ row }">
          <template v-if="!row.userTypeDisable">
            <Action :list="actionList" :row="row" />
          </template>
        </template>
      </Grid>
    </div>
    <FormModal @refresh="refreshTable" />
  </Page>
</template>
