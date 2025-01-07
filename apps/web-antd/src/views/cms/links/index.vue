<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { LinkApi } from '#/api/cms/link';
import type { CellTagProps } from '#/components/Table/CellRender';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { changeStatus, deleteLink, getLinkList } from '#/api/cms/link';
import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { message, Modal } from 'ant-design-vue';

import FormModel from './components/FormModel.vue';

interface RowType extends LinkApi.View {}

const formOptions: VbenFormProps = {
  collapsed: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'linksName',
      label: $t('cms_link.linksName'),
    },
    {
      component: 'Select',
      fieldName: 'type',
      componentProps: {
        options: [
          {
            label: '全站',
            value: '1',
          },
          {
            label: '内页',
            value: '2',
          },
        ],
      },
      label: $t('cms_link.type'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_status',
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: $t('cms_link.status'),
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'linksName',
      title: $t('cms_link.linksName'),
      formatter: 'formatEmpty',
      minWidth: 100,
    },
    {
      field: 'url',
      title: $t('cms_link.url'),
      formatter: 'formatEmpty',
      minWidth: 100,
    },
    {
      field: 'type',
      title: $t('cms_link.type'),
      cellRender: {
        name: 'CellTag',
        props: {
          checkedValue: '1',
          checkedText: '全站',
          unCheckedValue: '2',
          unCheckedText: '内页',
        } as CellTagProps,
      },
      minWidth: 100,
    },
    {
      cellRender: {
        name: 'switch',
        props: {
          checkedValue: '0',
          unCheckedValue: '1',
          onChangeStatus: async (checked: string, row: RowType) => {
            try {
              await changeStatus({
                status: checked,
                id: row.linksId,
              });
              row.status = checked;
              message.success($t('api.success'));
            } catch {
              row.status = checked === '0' ? '1' : '0';
            }
          },
        },
      },
      field: 'status',
      title: $t('cms_link.status'),
      minWidth: 100,
    },
    { field: 'orderNum', title: $t('cms_link.orderNum'), minWidth: 100 },
    {
      field: 'desc',
      title: $t('cms_link.desc'),
      minWidth: 100,
      showOverflow: true,
      formatter: 'formatEmpty',
    },
    { slots: { default: 'action' }, title: '操作', minWidth: 100 },
  ],
  proxyConfig: {
    ajax: {
      query: async (_, formValues) => {
        return await getLinkList({
          ...formValues,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModel,
});

const refreshTable = () => {
  gridApi.reload();
};

const onCreate = (parentId?: string) => {
  formModalApi.setState({ title: $t('cms_link.createLinks') });
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
    message.error($t('cms_link.selectLinks'));
    return;
  }
  Modal.confirm({
    title: $t('modal.confirmTitle'),
    content: $t('modal.confirmContent'),
    onOk: async () => {
      await deleteLink(records.map((item) => item.linksId).join(','));
      message.success($t('api.remove'));
      refreshTable();
    },
  });
};
const onUpdate = (row: RowType) => {
  formModalApi.setState({ title: $t('cms_link.updateTag') });
  formModalApi.setData({
    values: row,
    update: true,
    linksId: row.linksId,
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
