<script lang="ts" setup>
import type { VbenFormProps, VxeGridProps } from '#/adapter';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';

import { useVbenVxeGrid } from '#/adapter';
import { getList } from '#/api/system/user';
import { $t } from '#/locales';

interface RowType {
  userType: string;
}

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
      return row.userType !== '00';
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
    { field: 'nickName', title: $t('page.users.nickName') },
    { field: 'phone', title: $t('page.users.phone') },
    { field: 'email', title: $t('page.users.email') },
    {
      field: 'status',
      title: $t('page.users.status'),
      slots: { default: 'status' },
    },
    { field: 'loginIp', title: $t('page.users.loginIp') },
    {
      field: 'loginDate',
      title: $t('page.users.loginDate'),
      formatter: ({ cellValue }) => {
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
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
};

const [Grid] = useVbenVxeGrid({ formOptions, gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #avatar="{ row }">
        <a-avatar :src="row.avatar" />
      </template>
      <template #status="{ row }">
        <a-switch
          v-model:checked="row.status"
          checked-value="0"
          un-checked-value="1"
        />
      </template>
    </Grid>
  </Page>
</template>
