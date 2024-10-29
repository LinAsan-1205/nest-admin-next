<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref, watch } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeStatus,
  deleteDictData,
  type DictDataApi,
  getDictDataList,
} from '#/api/system/dict';

import DictType from './components/DictType.vue';
import DictDataFormModel from './components/FormModel.vue';

const dictType = ref<string>('');

interface RowType extends DictDataApi.Item {}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'dictLabel',
      label: $t('dictData.dictLabel'),
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
      label: $t('dictData.status'),
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
  },
  columns: [
    { type: 'checkbox', width: 50 },
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'dictLabel',
      title: $t('dictData.dictLabel'),
      minWidth: 100,
    },
    {
      field: 'dictValue',
      title: $t('dictData.dictValue'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'dictSort',
      title: $t('dictData.dictSort'),
      minWidth: 100,
    },
    {
      field: 'remark',
      title: $t('dictData.remark'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'status',
      title: $t('dictData.status'),
      slots: { default: 'status' },
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: $t('dictData.createTime'),
      formatter: 'formatDateTime',
      minWidth: 156,
    },
    { slots: { default: 'action' }, title: '操作', minWidth: 100 },
  ],
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ page }, formValues) => {
        return await getDictDataList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
          dictType: dictType.value,
        });
      },
    },
  },
  sortConfig: {
    multiple: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: DictDataFormModel,
});

const refreshTable = () => {
  gridApi.reload();
};

const onChangeStatus = async (checked: string, row: RowType) => {
  try {
    await changeStatus({ status: checked, dictCode: row.dictCode });
    row.status = checked;
    message.success($t('api.success'));
    refreshTable();
  } catch {
    row.status = checked === '0' ? '1' : '0';
  }
};

const onCreate = () => {
  if (dictType.value === '') {
    message.error($t('dictData.selectType'));
    return;
  }
  formModalApi.setState({ title: $t('dictData.createData') });
  formModalApi.setData({
    values: {
      dictType: dictType.value,
    },
    update: false,
  });
  formModalApi.open();
};

const onUpdate = (row: RowType) => {
  if (dictType.value === '') {
    message.error($t('dictData.selectType'));
    return;
  }
  formModalApi.setState({ title: $t('dictData.updateData') });
  formModalApi.setData({
    values: { ...row },
    update: true,
    dictCode: row.dictCode,
  });
  formModalApi.open();
};

const onRemove = async (ids?: RowType[]) => {
  if (dictType.value === '') {
    message.error($t('dictData.selectType'));
    return;
  }
  const records = ids || (gridApi.grid?.getCheckboxRecords() as RowType[]);
  if (records.length === 0) {
    message.error($t('dictData.selectData'));
    return;
  }
  Modal.confirm({
    title: $t('modal.confirmTitle'),
    content: $t('modal.confirmContent'),
    onOk: async () => {
      await deleteDictData(records.map((item) => item.dictCode).join(','));
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

watch(dictType, () => {
  refreshTable();
});
</script>

<template>
  <Page auto-content-height>
    <div class="md:flex md:h-full md:justify-between md:gap-4">
      <DictType v-model="dictType" />
      <div class="flex-1 md:w-[calc(100%-250px)]">
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
      </div>
    </div>
    <FormModal @refresh="refreshTable" />
  </Page>
</template>
