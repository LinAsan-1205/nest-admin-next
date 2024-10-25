<script setup lang="ts">
import { onMounted } from 'vue';

import { useVbenForm } from '#/adapter/form';
import { getConfigGroupList } from '#/api/system/config';

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
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
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入配置值',
      },
      fieldName: 'value',
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
        options: [
          {
            label: 'Input',
            value: 'input',
          },
          {
            label: 'InputNumber',
            value: 'inputNumber',
          },
        ],
      },
      fieldName: 'inputType',
      label: '输入组件',
      rules: 'selectRequired',
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

onMounted(() => {
  fetch();
});
</script>

<template>
  <a-card
    :body-style="{ padding: '10px', width: '100%' }"
    :bordered="false"
    class="mb-4 h-full w-[800px] md:mb-0"
  >
    <Form />
  </a-card>
</template>

<style scoped></style>
