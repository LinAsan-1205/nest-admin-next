<script setup lang="ts">
import { onMounted } from 'vue';

import { useVbenForm, z } from '#/adapter/form';
import {
  type ConfigModelApi,
  createConfig,
  getConfigGroupList,
} from '#/api/system/config';

const emit = defineEmits<{
  refresh: [];
}>();

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择所属组',
      },
      fieldName: 'groupId',
      label: '所属组',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入配置标题',
      },
      fieldName: 'name',
      label: '配置标题',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入配置标识',
      },
      fieldName: 'key',
      label: '配置标识',
      rules: z.string().refine((value: string) => /^[a-z_]+$/i.test(value), {
        message: '只允许输入字母',
      }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入配置值',
      },
      fieldName: 'value',
      help: '默认值',
      label: '配置值',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入排序值',
      },
      fieldName: 'sort',
      label: '排序',
      defaultValue: 0,
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: '请选择组件类型',
        onChange(_: Event, values: any) {
          formApi.updateSchema([
            {
              fieldName: 'configData',
              value: JSON.stringify(values.configData ?? {}) as any,
            },
          ]);
        },
        options: [
          {
            label: '文本框',
            value: 'input',
          },
          {
            label: '数字文本框',
            value: 'inputNumber',
          },
          {
            label: '密码文本框',
            value: 'inputPassword',
          },
          {
            label: '开关',
            value: 'switch',
          },
          {
            label: '评分',
            value: 'rate',
          },
          {
            label: '文件上传',
            value: 'upload',
          },
          {
            label: '字典下拉选择器',
            value: 'dictData',
          },
          {
            label: '日期选择器',
            value: 'datePicker',
            configData: {
              format: 'YYYY-MM-DD HH:mm:ss',
              'show-time': true,
              valueFormat: 'YYYY-MM-DD HH:mm:ss',
            },
          },
          {
            label: '日期范围选择器',
            value: 'rangePicker',
          },
          {
            label: '时间选择框',
            value: 'timePicker',
          },
        ],
      },
      defaultValue: 'input',
      fieldName: 'inputType',
      label: '输入组件',
      rules: 'selectRequired',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入配置说明',
      },
      fieldName: 'remark',
      label: '配置说明',
    },
    {
      component: 'MonacoEditor',
      componentProps: {
        class: 'h-[200px]',
      },
      dependencies: {
        if(values) {
          return !values.inputType.includes('input');
        },
        triggerFields: ['inputType'],
      },
      defaultValue: '{}',
      fieldName: 'configData',
      label: '组件配置',
      help: '用于配置指定组件的props参数等',
    },
  ],
  wrapperClass: 'grid-cols-1',
});
const fetch = () => {
  getConfigGroupList().then((res) => {
    formApi.updateSchema([
      {
        componentProps: {
          options: res.flatMap((item) => ({
            label: item.groupName,
            value: item.groupId,
          })),
        },
        fieldName: 'groupId',
      },
    ]);
  });
};

async function onSubmit(values: Record<string, any>) {
  await createConfig(values as ConfigModelApi.CreateParams);
  await formApi.resetForm();
  emit('refresh');
}

onMounted(() => {
  fetch();
});
</script>

<template>
  <a-card
    :body-style="{ padding: '10px', width: '100%' }"
    :bordered="false"
    class="mb-4 h-full flex-1 md:mb-0"
  >
    <Form />
  </a-card>
</template>

<style scoped></style>
