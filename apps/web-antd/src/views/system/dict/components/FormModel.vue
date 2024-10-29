<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createDictData,
  type DictDataApi,
  updateDictData,
} from '#/api/system/dict';
import { $t } from '#/locales';

defineOptions({
  name: 'DictDataFormModel',
});

const emit = defineEmits<{
  refresh: [];
}>();

const updateTheStatus = ref<boolean>(false);

const dictCode = ref<string>();

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
        disabled: true,
      },
      formItemClass: 'col-span-2',
      fieldName: 'dictType',
      label: $t('dictData.dictType'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-2',
      fieldName: 'dictLabel',
      label: $t('dictData.dictLabel'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-2',
      fieldName: 'dictValue',
      label: $t('dictData.dictValue'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-2',
      fieldName: 'color',
      label: $t('dictData.color'),
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-2',
      defaultValue: 0,
      fieldName: 'dictSort',
      label: $t('dictData.dictSort'),
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: '正常',
            value: '0',
          },
          {
            label: '禁用',
            value: '1',
          },
        ],
      },
      defaultValue: '0',
      fieldName: 'status',
      label: $t('dictData.status'),
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
      label: $t('dictData.remark'),
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
        dictCode: id,
      } = modalApi.getData<Record<string, any>>();
      // 修改时设置表单值
      if (values) {
        formApi.setValues(values);
      }
      updateTheStatus.value = update;
      dictCode.value = update ? id : '';
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  const data = values as DictDataApi.FormModelParams;
  const messageContent = updateTheStatus.value
    ? $t('api.editSuccess')
    : $t('api.createSuccess');
  await (updateTheStatus.value
    ? updateDictData(dictCode.value as string, data)
    : createDictData(data));
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
