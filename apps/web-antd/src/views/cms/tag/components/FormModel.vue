<script lang="ts" setup>
import type { TagApi } from '#/api/cms/tag';

import { useVbenForm } from '#/adapter/form';
import { createTag, updateTag } from '#/api/cms/tag';
import { $t } from '#/locales';
import { useVbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';
import { ref } from 'vue';

defineOptions({
  name: 'CmsTagFormModel',
});

const emit = defineEmits<{
  refresh: [];
}>();

const updateTheStatus = ref<boolean>(false);

const roleId = ref<string>();

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
      fieldName: 'tagsName',
      label: $t('cms_tag.tagName'),
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      defaultValue: 0,
      fieldName: 'orderNum',
      label: $t('cms_tag.orderNum'),
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
      label: $t('cms_tag.status'),
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
      label: $t('cms_tag.desc'),
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
        tagId: id,
      } = modalApi.getData<Record<string, any>>();
      // 修改时设置表单值
      if (values) {
        formApi.setValues(values);
      }
      updateTheStatus.value = update;
      roleId.value = update ? id : '';
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  const data = values as TagApi.FormParams;
  const messageContent = updateTheStatus.value
    ? $t('api.editSuccess')
    : $t('api.createSuccess');
  await (updateTheStatus.value
    ? updateTag(roleId.value as string, data)
    : createTag(data));
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
