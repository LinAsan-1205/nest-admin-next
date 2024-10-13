<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { createMenu, type MenuApi, updateMenu } from '#/api/system/menu';
import { $t } from '#/locales';

defineOptions({
  name: 'MenuFormModel',
});

const emit = defineEmits<{
  refresh: [];
}>();

const updateTheStatus = ref<boolean>(false);

const menuId = ref<string>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  wrapperClass: 'grid-cols-2',
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Select',
      componentProps: {
        class: 'w-full',
        options: [
          {
            label: '目录',
            value: 'M',
          },
          {
            label: '菜单',
            value: 'C',
          },
          {
            label: '按钮',
            value: 'F',
          },
        ],
        placeholder: '请选择菜单类型',
      },
      formItemClass: 'col-span-2',
      defaultValue: 'M',
      fieldName: 'menuType',
      label: $t('page.menu.menuType'),
    },
    {
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请选择',
        treeData: [],
        fieldNames: {
          children: 'children',
          label: 'deptName',
          value: 'menuId',
        },
      },
      defaultValue: '',
      formItemClass: 'col-span-2',
      fieldName: 'parentId',
      label: $t('page.menu.parentId'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-2',
      fieldName: 'menuName',
      label: $t('page.menu.menuName'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },
      formItemClass: 'col-span-2',
      fieldName: 'path',
      label: $t('page.menu.path'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },
      formItemClass: 'col-span-2',
      fieldName: 'redirect',
      label: $t('page.menu.redirect'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show(values) {
          return values.menuType === 'F';
        },
        triggerFields: ['menuType'],
      },
      formItemClass: 'col-span-2',
      fieldName: 'perms',
      label: $t('page.menu.perms'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入组件路径',
      },
      dependencies: {
        show(values) {
          return values.menuType === 'C';
        },
        triggerFields: ['menuType'],
      },
      formItemClass: 'col-span-2',
      fieldName: 'component',
      label: $t('page.menu.component'),
      rules: 'required',
      renderComponentContent: () => ({
        prefix: () => '#/views/',
        suffix: () => '.vue',
      }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },
      formItemClass: 'col-span-2',
      fieldName: 'name',
      label: $t('page.menu.name'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-2',
      defaultValue: 0,
      fieldName: 'order',
      label: $t('page.menu.order'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_dept_status',
        placeholder: '请选择状态',
        componentName: 'radio',
      },
      defaultValue: '0',
      fieldName: 'status',
      label: $t('page.dept.status'),
      rules: 'selectRequired',
    },

    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入',
        autoSize: { minRows: 3, maxRows: 5 },
      },
      formItemClass: 'col-span-2',
      fieldName: 'remark',
      label: $t('page.dept.remark'),
    },
  ],
  showDefaultActions: false,
});
const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel() {
    modalApi.close();
    formApi.resetForm();
  },
  onConfirm: async () => {
    const { valid } = await formApi.validate();
    if (valid) {
      await formApi.submitForm();
    }
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const {
        values,
        update,
        menuId: id,
      } = modalApi.getData<Record<string, any>>();
      // 修改时设置表单值
      if (values) {
        formApi.setValues(values);
      }
      updateTheStatus.value = update;
      menuId.value = update ? id : '';
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  const data = values as MenuApi.FormModelParams;
  const messageContent = updateTheStatus.value
    ? $t('page.apiEditSuccess')
    : $t('page.apiCreateSuccess');
  await (updateTheStatus.value
    ? updateMenu(menuId.value as string, data)
    : createMenu(data));
  message.success(messageContent);
  modalApi.close();
  emit('refresh');
}
</script>
<template>
  <Modal class="md:w-[800px]">
    <Form />
  </Modal>
</template>
