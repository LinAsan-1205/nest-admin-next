<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref, watch } from 'vue';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  type AttachmentApi,
  deleteAttachment,
  getAttachmentList,
} from '#/api/system/attachment';

import ClassifyThree from './components/ClassifyThree.vue';
import UploadButton from './components/UploadButton.vue';

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
      showOverflow: 'tooltip',
      minWidth: 100,
    },
    {
      field: 'originName',
      title: $t('page.attachment.originName'),
      minWidth: 100,
      showOverflow: 'tooltip',
      formatter: 'formatEmpty',
    },
    {
      field: 'sizeByte',
      title: $t('page.attachment.sizeByte'),
      formatter: 'formatSize',
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
  height: 'auto',
  proxyConfig: {
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

const refreshTable = () => {
  gridApi.reload();
};

const onRemove = async (ids?: RowType[]) => {
  const records = ids || (gridApi.grid?.getCheckboxRecords() as RowType[]);
  if (records.length === 0) {
    message.error($t('page.attachment.selectData'));
    return;
  }
  Modal.confirm({
    title: $t('page.modal.confirmTitle'),
    content: $t('page.modal.confirmContent'),
    onOk: async () => {
      await deleteAttachment(
        records.map((item) => item.attachmentId).join(','),
      );
      message.success($t('page.apiRemove'));
      refreshTable();
    },
  });
};

const toolbarActionList = [
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
          <template #action="{ row }">
            <TableAction :list="actionList" :row="row" />
          </template>
          <template #toolbar-actions>
            <UploadButton :classify-id="classifyId" @change="refreshTable" />
            <TableAction :list="toolbarActionList" type="toolbar" />
          </template>
        </Grid>
      </div>
    </div>
  </Page>
</template>
