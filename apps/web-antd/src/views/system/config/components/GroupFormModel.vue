<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  type ConfigGroupModelApi,
  createConfigGroup,
  updateConfigGroup,
} from '#/api/system/config';
import { $t } from '#/locales';

defineOptions({
  name: 'GroupFormModel',
});

const emit = defineEmits<{
  refresh: [];
}>();

const updateTheStatus = ref<boolean>(false);

const groupId = ref<string>();

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
      formItemClass: 'col-span-2',
      fieldName: 'groupName',
      label: $t('config.group.groupName'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-2',
      fieldName: 'code',
      label: $t('config.group.code'),
      rules: 'required',
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入',
        autoSize: { minRows: 3, maxRows: 5 },
      },
      formItemClass: 'col-span-2',
      fieldName: 'remark',
      label: $t('config.remark'),
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
        groupId: id,
      } = modalApi.getData<Record<string, any>>();
      // 修改时设置表单值
      if (values) {
        formApi.setValues(values);
      }
      updateTheStatus.value = update;
      groupId.value = update ? id : '';
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  const data = values as ConfigGroupModelApi.Item;
  const messageContent = updateTheStatus.value
    ? $t('page.apiEditSuccess')
    : $t('page.apiCreateSuccess');
  await (updateTheStatus.value
    ? updateConfigGroup(groupId.value as string, data)
    : createConfigGroup(data));
  message.success(messageContent);
  modalApi.close();
  emit('refresh');
}
</script>
<template>
  <Modal class="md:w-[600px]">
    <Form />
  </Modal>
</template>
