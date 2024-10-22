<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createDept,
  type DeptApi,
  getDeptList,
  updateDept,
} from '#/api/system/dept';
import { $t } from '#/locales';

defineOptions({
  name: 'RoleFormModel',
});

const emit = defineEmits<{
  refresh: [];
}>();

const updateTheStatus = ref<boolean>(false);

const deptId = ref<string>();

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
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'roleName',
      label: $t('role.roleName'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'roleKey',
      label: $t('role.roleKey'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      defaultValue: 0,
      fieldName: 'roleSort',
      label: $t('role.roleSort'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_role_status',
        placeholder: '请选择状态',
        componentName: 'radio',
      },
      defaultValue: '0',
      fieldName: 'status',
      label: $t('role.status'),
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
      label: $t('role.remark'),
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
        deptId: id,
      } = modalApi.getData<Record<string, any>>();
      // 修改时设置表单值
      if (values) {
        formApi.setValues(values);
      }
      updateTheStatus.value = update;
      deptId.value = update ? id : '';
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  const data = values as DeptApi.CreateParams;
  const messageContent = updateTheStatus.value
    ? $t('page.apiEditSuccess')
    : $t('page.apiCreateSuccess');
  await (updateTheStatus.value
    ? updateDept(deptId.value as string, data)
    : createDept(data));
  message.success(messageContent);
  modalApi.close();
  emit('refresh');
}

onMounted(async () => {
  await getDeptList({}).then((res) => {
    formApi.updateSchema([
      {
        fieldName: 'parentId',
        componentProps: {
          treeData: res,
        },
      },
    ]);
  });
});
</script>
<template>
  <Modal class="md:w-[800px]">
    <Form />
  </Modal>
</template>
