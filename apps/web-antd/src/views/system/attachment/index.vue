<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref, watch } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { type AttachmentApi, getAttachmentList } from '#/api/system/attachment';
import { changeStatus, deleteDictData } from '#/api/system/dict';

import ClassifyThree from './components/ClassifyThree.vue';
import FormModel from './components/FormModel.vue';

const classifyId = ref<string>('');

interface RowType extends AttachmentApi.Item {}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'objectName',
      label: $t('page.attachment.objectName'),
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
      field: 'objectName',
      title: $t('page.attachment.objectName'),
      minWidth: 100,
    },
    {
      field: 'originName',
      title: $t('page.attachment.originName'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'sizeByte',
      title: $t('page.attachment.sizeByte'),
      minWidth: 100,
    },
    {
      field: 'suffix',
      title: $t('page.attachment.suffix'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'mimeType',
      title: $t('page.attachment.mimeType'),
      minWidth: 100,
    },
    {
      field: 'storagePath',
      title: $t('page.attachment.storagePath'),
      minWidth: 100,
    },
    {
      field: 'createTime',
      title: $t('page.dept.createTime'),
      formatter: 'formatDateTime',
      minWidth: 156,
    },
    { slots: { default: 'action' }, title: '操作', minWidth: 100 },
  ],
  proxyConfig: {
    autoLoad: false,
    ajax: {
      query: async ({ page }, formValues) => {
        return await getAttachmentList({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
          classifyId: classifyId.value,
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
  connectedComponent: FormModel,
});

const refreshTable = () => {
  gridApi.reload();
};

const onChangeStatus = async (checked: string, row: RowType) => {
  try {
    await changeStatus({ status: checked, dictCode: row.dictCode });
    row.status = checked;
    message.success($t('page.apiSuccess'));
    refreshTable();
  } catch {
    row.status = checked === '0' ? '1' : '0';
  }
};

const onCreate = () => {
  if (classifyId.value === '') {
    message.error($t('page.dictData.selectType'));
    return;
  }
  formModalApi.setState({ title: $t('page.dictData.createData') });
  formModalApi.setData({
    values: {
      classifyId: classifyId.value,
    },
    update: false,
  });
  formModalApi.open();
};

const onUpdate = (row: RowType) => {
  if (classifyId.value === '') {
    message.error($t('page.dictData.selectType'));
    return;
  }
  formModalApi.setState({ title: $t('page.dictData.updateData') });
  formModalApi.setData({
    values: { ...row },
    update: true,
    dictCode: row.dictCode,
  });
  formModalApi.open();
};

const onRemove = async (ids?: RowType[]) => {
  if (classifyId.value === '') {
    message.error($t('page.dictData.selectType'));
    return;
  }
  const records = ids || (gridApi.grid?.getCheckboxRecords() as RowType[]);
  if (records.length === 0) {
    message.error($t('page.dictData.selectData'));
    return;
  }
  Modal.confirm({
    title: $t('page.modal.confirmTitle'),
    content: $t('page.modal.confirmContent'),
    onOk: async () => {
      await deleteDictData(records.map((item) => item.dictCode).join(','));
      message.success($t('page.apiRemove'));
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

watch(classifyId, () => {
  refreshTable();
});
</script>

<template>
  <Page auto-content-height>
    <div class="md:flex md:h-full md:justify-between md:gap-4">
      <ClassifyThree v-model="classifyId" />
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
