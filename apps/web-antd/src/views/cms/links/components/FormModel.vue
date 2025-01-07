<script lang="ts" setup>
import type { LinkApi } from '#/api/cms/link';

import { useVbenForm } from '#/adapter/form';
import { createLink, updateLink } from '#/api/cms/link';
import { $t } from '#/locales';
import { useVbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';
import { ref } from 'vue';

defineOptions({
  name: 'CmsLinkFormModel',
});

const emit = defineEmits<{
  refresh: [];
}>();

const updateTheStatus = ref<boolean>(false);

const linksId = ref<string>();

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
      component: 'UploadFile',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-2',
      fieldName: 'icon',
      label: $t('cms_link.icon'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'linksName',
      label: $t('cms_link.linksName'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'url',
      label: $t('cms_link.url'),
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请输入',
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
      fieldName: 'type',
      label: $t('cms_link.type'),
      rules: 'required',
      defaultValue: '1',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      defaultValue: 0,
      fieldName: 'orderNum',
      label: $t('cms_link.orderNum'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_status',
        placeholder: '请选择状态',
        componentName: 'radio',
      },
      defaultValue: '0',
      fieldName: 'status',
      label: $t('cms_link.status'),
      rules: 'selectRequired',
    },

    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入',
        autoSize: { minRows: 3, maxRows: 5 },
      },
      formItemClass: 'col-span-2',
      fieldName: 'desc',
      label: $t('cms_link.desc'),
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
        linksId: id,
      } = modalApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
      }
      updateTheStatus.value = update;
      linksId.value = update ? id : '';
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  const data = values as LinkApi.FormParams;
  const messageContent = updateTheStatus.value
    ? $t('api.editSuccess')
    : $t('api.createSuccess');
  await (updateTheStatus.value
    ? updateLink(linksId.value as string, data)
    : createLink(data));
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
