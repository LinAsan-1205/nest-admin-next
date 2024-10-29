<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {
  createDictType,
  type DictTypeApi,
  updateDictType,
} from '#/api/system/dict';
import { $t } from '#/locales';

defineOptions({
  name: 'DictTypeFormModel',
});

const emit = defineEmits<{
  refresh: [];
}>();

const updateTheStatus = ref<boolean>(false);

const dictTypeId = ref<string>();

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
      fieldName: 'dictName',
      label: $t('dictType.dictName'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      formItemClass: 'col-span-2',
      fieldName: 'dictType',
      label: $t('dictType.dictType'),
      rules: 'required',
    },
    // {
    //   component: 'InputNumber',
    //   componentProps: {
    //     placeholder: '请输入',
    //   },
    //   defaultValue: 0,
    //   fieldName: 'orderNum',
    //   label: $t('page.dept.orderNum'),
    // },
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
      label: $t('dictType.status'),
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
      label: $t('dictType.remark'),
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
        dictTypeId: id,
      } = modalApi.getData<Record<string, any>>();
      // 修改时设置表单值
      if (values) {
        formApi.setValues(values);
      }
      updateTheStatus.value = update;
      dictTypeId.value = update ? id : '';
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  const data = values as DictTypeApi.FormModelParams;
  const messageContent = updateTheStatus.value
    ? $t('page.apiEditSuccess')
    : $t('page.apiCreateSuccess');
  await (updateTheStatus.value
    ? updateDictType(dictTypeId.value as string, data)
    : createDictType(data));
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
