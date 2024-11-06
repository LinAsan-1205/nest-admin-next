<script setup lang="ts">
import { onMounted } from 'vue';

import { $t } from '@vben/locales';
import { useUserStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { updateBasicInformation, type UserApi } from '#/api/system/user';

const { userInfo } = useUserStore();

const [BaseForm, baseFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: `请输入${$t('users.nickName')}`,
      },
      fieldName: 'nickName',
      label: $t('users.nickName'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_user_sex',
        placeholder: `请选择${$t('users.sex')}`,
        componentName: 'radio',
      },
      fieldName: 'sex',
      label: $t('users.sex'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入用户名',
      },
      fieldName: 'signed',
      label: '个人签名',
    },
  ],
});

function onSubmit(values: UserApi.BasicInformationParams) {
  updateBasicInformation({
    ...values,
    userId: userInfo?.userId,
  }).then(() => {
    message.success('更新成功');
  });
}
onMounted(() => {
  baseFormApi.setValues({
    nickName: userInfo?.nickName,
    sex: userInfo?.sex,
    signed: userInfo?.signed,
  });
});
</script>

<template>
  <BaseForm />
</template>

<style scoped></style>
