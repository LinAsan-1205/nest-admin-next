<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { CellTagProps } from '#/components/Table/CellRender';

import { Page, useVbenModal } from '@vben/common-ui';
import { createIconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  changeStatus,
  deleteMenu,
  getMenuList,
  type MenuApi,
} from '#/api/system/menu';

import MenuFormModel from './components/FormModel.vue';

interface RowType extends MenuApi.Item {}

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'menuName',
      label: $t('page.menu.menuName'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_dept_status',
        placeholder: '请选择状态',
      },
      fieldName: 'status',
      label: $t('page.menu.status'),
    },
  ],
};

const gridOptions: VxeGridProps<RowType> = {
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'menuName',
      title: $t('page.menu.menuName'),
      treeNode: true,
      minWidth: 100,
    },
    {
      cellRender: {
        name: 'DictTag',
        props: {
          dictType: 'sys_menu_type',
        },
      },
      field: 'menuType',
      title: $t('page.menu.menuType'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'icon',
      title: $t('page.menu.icon'),
      minWidth: 100,
      formatter: 'formatEmpty',
      slots: { default: 'icon' },
    },
    {
      field: 'perms',
      title: $t('page.menu.perms'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'path',
      title: $t('page.menu.path'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'component',
      title: $t('page.menu.component'),
      minWidth: 100,
      formatter: 'formatEmpty',
    },
    {
      field: 'keepAlive',
      cellRender: {
        name: 'CellTag',
        props: {
          checkedValue: true,
          checkedText: '是',
          unCheckedValue: false,
          unCheckedText: '否',
        } as CellTagProps,
      },
      title: $t('page.menu.keepAlive'),
      minWidth: 100,
    },
    {
      field: 'hideInMenu',
      cellRender: {
        name: 'CellTag',
        props: {
          checkedValue: false,
          unCheckedValue: true,
        } as CellTagProps,
      },
      title: $t('page.menu.hideInMenu'),
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
              await changeStatus({ status: checked, id: row.menuId });
              row.status = checked;
              message.success($t('page.apiSuccess'));
            } catch {
              row.status = checked === '0' ? '1' : '0';
            }
          },
        },
      },
      field: 'status',
      title: $t('page.menu.status'),
      // slots: { default: 'status' },
      minWidth: 100,
    },
    { field: 'order', title: $t('page.menu.order'), minWidth: 100 },
    {
      cellRender: {
        name: 'TableAction',
        props: {
          list: [
            {
              title: '编辑',
              onClick: (row: RowType) => {
                // eslint-disable-next-line no-use-before-define
                onUpdate(row);
              },
            },
            {
              title: '新增',
              onClick: (row: RowType) => {
                // eslint-disable-next-line no-use-before-define
                onCreate(row.menuId);
              },
            },
            {
              title: '删除',
              danger: true,
              onClick: (row: RowType) => {
                // eslint-disable-next-line no-use-before-define
                onRemove([row]);
              },
            },
          ],
        },
      },
      fixed: 'right',
      title: '操作',
      minWidth: 100,
    },
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
        return await getMenuList({
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
  connectedComponent: MenuFormModel,
});

const refreshTable = () => {
  gridApi.reload();
};
const onCreate = (parentId?: string) => {
  formModalApi.setState({ title: $t('page.menu.createMenu') });
  formModalApi.setData({
    values: {
      parentId,
    },
    update: false,
  });
  formModalApi.open();
};
const onUpdate = (row: RowType) => {
  formModalApi.setState({ title: $t('page.menu.updateMenu') });
  formModalApi.setData({
    values: { ...row },
    update: true,
    menuId: row.menuId,
  });
  formModalApi.open();
};

const onRemove = async (ids?: RowType[]) => {
  const records = ids || (gridApi.grid?.getCheckboxRecords() as RowType[]);
  if (records.length === 0) {
    message.error($t('page.menu.selectMenu'));
    return;
  }
  Modal.confirm({
    title: $t('page.modal.confirmTitle'),
    content: $t('page.modal.confirmContent'),
    onOk: async () => {
      await deleteMenu(records.map((item) => item.menuId).join(','));
      message.success($t('page.apiRemove'));
      refreshTable();
    },
  });
};
const onChangeStatus = async (checked: string, row: RowType) => {
  try {
    await changeStatus({ status: checked, id: row.menuId });
    row.status = checked;
    message.success($t('page.apiSuccess'));
    refreshTable();
  } catch {
    row.status = checked === '0' ? '1' : '0';
  }
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
      <template #icon="{ row }">
        <div class="flex items-center justify-center text-lg">
          <component :is="createIconifyIcon(row.icon)" />
        </div>
      </template>

      <template #toolbar-actions>
        <TableAction :list="toolbarActionList" type="toolbar" />
      </template>
    </Grid>
    <FormModal @refresh="refreshTable" />
  </Page>
</template>
