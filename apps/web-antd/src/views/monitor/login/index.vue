<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getLoginLogList, type LoginLogApi } from '#/api/monitor/login';

interface RowType extends LoginLogApi.Item {}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'userName',
      label: $t('log.login.userName'),
    },
    {
      component: 'Input',
      fieldName: 'ip',
      label: $t('log.login.ip'),
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'userName',
      title: $t('log.login.userName'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'ip',
      title: $t('log.login.ip'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'country',
      title: $t('log.login.country'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'province',
      title: $t('log.login.province'),
      formatter: 'formatEmpty',
      minWidth: 100,
    },
    {
      field: 'city',
      title: $t('log.login.city'),
      formatter: 'formatEmpty',
      minWidth: 100,
    },
    {
      field: 'district',
      title: $t('log.login.district'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'isp',
      title: $t('log.login.isp'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'browser',
      title: $t('log.login.browser'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'os',
      title: $t('log.login.os'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'msg',
      title: $t('log.login.msg'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'loginTime',
      title: $t('log.login.loginTime'),
      formatter: 'formatDateTime',
      minWidth: 156,
    },
  ],
  height: 'auto',
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await getLoginLogList({
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

const [Grid] = useVbenVxeGrid({ formOptions, gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid />
  </Page>
</template>
