<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import {
  createMenu,
  getMenuList,
  type MenuApi,
  updateMenu,
} from '#/api/system/menu';
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
    labelWidth: 120,
    componentProps: {
      class: 'w-full',
    },
  },
  wrapperClass: 'grid-cols-2',
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'DictData',
      componentProps: {
        class: 'w-full',
        dictType: 'sys_menu_type',
        componentName: 'radio',
        placeholder: '请选择菜单类型',
        buttonStyle: 'solid',
      },
      formItemClass: 'col-span-2',
      defaultValue: 'M',
      fieldName: 'menuType',
      label: $t('page.menu.menuType'),
      rules: 'required',
    },
    {
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请选择',
        treeData: [],
        fieldNames: {
          children: 'children',
          label: 'menuName',
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
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },
      formItemClass: 'col-span-2',
      fieldName: 'icon',
      label: $t('page.menu.icon'),
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
      help: '组件名称:(类似唯一的key,后续操作路由可以根据key来跳转等操作)',
      fieldName: 'name',
      label: $t('page.menu.name'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show(values) {
          return values.menuType === 'C';
        },
        triggerFields: ['menuType'],
      },
      help: '用于配置外链跳转路径，会在新窗口打开',
      formItemClass: 'col-span-2',
      fieldName: 'link',
      label: $t('page.menu.link'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show(values) {
          return values.menuType === 'C';
        },
        triggerFields: ['menuType'],
      },
      help: '用于配置内嵌页面的 iframe 地址，设置后会在当前页面内嵌对应的页面',
      formItemClass: 'col-span-2',
      fieldName: 'iframeSrc',
      label: $t('page.menu.iframeSrc'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show(values) {
          return values.menuType === 'C';
        },
        triggerFields: ['menuType'],
      },
      help: '用于配置当前激活的菜单，有时候页面没有显示在菜单内，需要激活父级菜单时使用',
      formItemClass: 'col-span-2',
      fieldName: 'activePath',
      label: $t('page.menu.activePath'),
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
      help: '用于配置页面的徽标，会在菜单显示',
      fieldName: 'badge',
      label: $t('page.menu.badge'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_menu_badge_type',
        componentName: 'radio',
        placeholder: '请输入',
      },
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },

      defaultValue: 'dot',
      help: '用于配置页面的徽标类型',
      fieldName: 'badgeType',
      label: $t('page.menu.badgeType'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_menu_badge_variants',
        placeholder: '请输入',
      },
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },
      formItemClass: 'col-span-2',
      defaultValue: 'default',
      help: '用于配置页面的徽标颜色',
      fieldName: 'badgeVariants',
      label: $t('page.menu.badgeVariants'),
    },
    {
      component: 'Switch',
      componentProps: {
        placeholder: '请输入',
        class: 'w-auto',
        checkedChildren: '开',
        unCheckedChildren: '关',
        checkedValue: true,
        unCheckedValue: false,
      },
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },
      defaultValue: false,
      fieldName: 'keepAlive',
      help: '开启后会对路由的内容进行缓存',
      label: $t('page.menu.keepAlive'),
    },
    {
      component: 'Switch',
      componentProps: {
        placeholder: '请输入',
        class: 'w-auto',
        checkedChildren: '显示',
        unCheckedChildren: '隐藏',
        checkedValue: false,
        unCheckedValue: true,
      },
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },
      defaultValue: false,
      help: '当前路由在菜单中不展现',
      fieldName: 'hideInMenu',
      label: $t('page.menu.hideInMenu'),
    },
    {
      component: 'Switch',
      componentProps: {
        placeholder: '请输入',
        class: 'w-auto',
        checkedChildren: '展示',
        unCheckedChildren: '不展示',
        checkedValue: false,
        unCheckedValue: true,
      },
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },
      defaultValue: false,
      help: '当前路由在面包屑中不展现',
      fieldName: 'hideInBreadcrumb',
      label: $t('page.menu.hideInBreadcrumb'),
    },
    {
      component: 'Switch',
      componentProps: {
        placeholder: '请输入',
        class: 'w-auto',
        checkedChildren: '展示',
        unCheckedChildren: '不展示',
        checkedValue: false,
        unCheckedValue: true,
      },
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },
      defaultValue: false,
      help: '当前路由在标签页不展现',
      fieldName: 'hideInTab',
      label: $t('page.menu.hideInTab'),
    },
    {
      component: 'Switch',
      componentProps: {
        placeholder: '请输入',
        class: 'w-auto',
        checkedChildren: '显示',
        unCheckedChildren: '隐藏',
        checkedValue: false,
        unCheckedValue: true,
      },
      dependencies: {
        show(values) {
          return values.menuType !== 'F';
        },
        triggerFields: ['menuType'],
      },
      defaultValue: false,
      help: '隐藏当前路由的子菜单',
      fieldName: 'hideChildrenInMenu',
      label: $t('page.menu.hideChildrenInMenu'),
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
      help: '用于当前数据是否显示',
      label: $t('page.menu.status'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入',
        autoSize: { minRows: 3, maxRows: 5 },
      },
      formItemClass: 'col-span-2',
      fieldName: 'remark',
      label: $t('page.menu.remark'),
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
      formApi.updateSchema([
        {
          fieldName: 'menuType',
          componentProps: {
            disabled: update,
          },
        },
      ]);
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

const fetch = () => {
  getMenuList().then((res) => {
    formApi.updateSchema([
      {
        fieldName: 'parentId',
        componentProps: {
          treeData: res,
        },
      },
    ]);
  });
};

onMounted(() => {
  fetch();
});
</script>
<template>
  <Modal class="md:w-[800px]">
    <Form />
  </Modal>
</template>
