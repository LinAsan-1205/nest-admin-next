<script lang="ts" setup>
import type { VbenFormProps, VxeGridProps } from '#/adapter';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter';
import { type DeptApi, getDeptList } from '#/api/system/dept';
import { changeStatus, getList, type UserApi } from '#/api/system/user';
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
        format: 'YYYY-MM-DD HH:mm',
        valueFormat: 'YYYY-MM-DD HH:mm',
      },
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    checkMethod: ({ row }) => {
      return row.userTypeDisable;
    },
  },
  columns: [
    { type: 'checkbox', width: 50 },
    {
      field: 'avatar',
      title: $t('page.users.avatar'),
      slots: { default: 'avatar' },
    },
    { field: 'userName', title: $t('page.users.userName') },
    {
      field: 'nickName',
      title: $t('page.users.nickName'),
      formatter: ({ cellValue }) => {
        if (!cellValue) return '未设置';
        return cellValue;
      },
    },
    {
      field: 'phone',
      title: $t('page.users.phone'),
      formatter: ({ cellValue }) => {
        if (!cellValue) return '未绑定';
        return cellValue;
      },
    },
    {
      field: 'email',
      title: $t('page.users.email'),
      formatter: ({ cellValue }) => {
        if (!cellValue) return '未绑定';
        return cellValue;
      },
    },
    {
      field: 'status',
      title: $t('page.users.status'),
      slots: { default: 'status' },
    },
    {
      field: 'loginIp',
      title: $t('page.users.loginIp'),
      formatter: ({ cellValue }) => {
        if (!cellValue) return '未登陆';
        return cellValue;
      },
    },
    {
      field: 'loginDate',
      title: $t('page.users.loginDate'),
      formatter: ({ cellValue }) => {
        if (!cellValue) return '未登陆';
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      field: 'createTime',
      title: $t('page.users.createTime'),
      formatter: ({ cellValue }) => {
        return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
      },
    },
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
  await changeStatus({ status: checked, id: row.userId });
  row.status = checked;
  message.success($t('page.apiSuccess'));
  refreshTable();
};

const onTreeSelect = (selectedKeys: string[]) => {
  deptId.value = selectedKeys[0] || null;
  refreshTable();
};

const onCreate = () => {
  formModalApi.setState({ title: $t('page.users.createUser') });
  formModalApi.open();
};

// const onUpdate = () => {
//   formModalApi.setState({ title: $t('page.users.editUser') });
//   formModalApi.open();
// };

const onRemove = () => {
  const records = gridApi.grid?.getCheckboxRecords() as RowType[];
  if (records.length === 0) {
    message.error($t('page.users.selectUser'));
  }
};

onMounted(async () => {
  await getDeptList({}).then((res) => {
    deptList.value = res;
  });
});
</script>

<template>
  <Page>
    <div class="md:flex md:justify-between md:gap-4">
      <a-card :bordered="false" class="mb-4 flex-none md:mb-0 md:w-[250px]">
        <a-tree
          :field-names="{
            title: 'deptName',
            key: 'deptId',
            children: 'children',
          }"
          :tree-data="deptList"
          block-node
          @select="onTreeSelect"
        />
      </a-card>
      <Grid class="flex-1">
        <template #toolbar-actions>
          <a-space>
            <Button type="primary" @click="onCreate">新增</Button>
            <Button danger type="primary" @click="onRemove">删除</Button>
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
      </Grid>
    </div>
    <FormModal @refresh="refreshTable" />
  </Page>
</template>
