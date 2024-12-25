<script lang="ts" setup>
import { useRouter } from 'vue-router';

import { Page, useVbenModal } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { $t } from '#/locales';

import FormModel from './components/FormModel.vue';

const router = useRouter();

const [Form] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  layout: 'vertical',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'title',
      label: $t('cms_posts.title'),
      rules: 'required',
    },
    {
      component: 'MdEditor',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'content',
      label: $t('cms_posts.content'),
      rules: 'required',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModel,
});

function onSubmit(values: Record<string, any>) {
  formModalApi.setState({ title: $t('cms_posts.create_title') });
  formModalApi.setData({
    values,
    update: false,
  });
  formModalApi.open();
}

function onRefresh() {
  router.push('/cms/posts/create');
}
</script>

<template>
  <Page>
    <Card>
      <!--      <template #extra>-->
      <!--        <Button type="primary" @click="() => formApi.validate()">发布</Button>-->
      <!--        <Button class="mx-2" @click="() => formApi.resetValidate()">-->
      <!--          清空校验信息-->
      <!--        </Button>-->
      <!--      </template>-->
      <Form />
    </Card>
    <FormModal @refresh="onRefresh" />
  </Page>
</template>
