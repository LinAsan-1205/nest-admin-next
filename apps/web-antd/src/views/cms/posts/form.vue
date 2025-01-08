<script lang="ts" setup>
import type { PostsApi } from '#/api/cms/posts';

import { useVbenForm } from '#/adapter/form';
import { getPostsDetails } from '#/api/cms/posts';
import { $t } from '#/locales';
import { Page, useVbenModal } from '@vben/common-ui';
import { Card } from 'ant-design-vue';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import FormModel from './components/FormModel.vue';

const route = useRoute();
const router = useRouter();

const details = ref<PostsApi.View>({});

const [Form, formApi] = useVbenForm({
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
  formModalApi.setState({
    title: $t(
      route.params?.id ? 'cms_posts.update_title' : 'cms_posts.update_title',
    ),
  });
  if (route.params?.id) {
    formModalApi.setData({
      values: {
        ...details.value,
        ...values,
      },
      update: true,
      id: route.params?.id,
    });
  } else {
    formModalApi.setData({
      values,
      update: false,
    });
  }
  formModalApi.open();
}

function onRefresh() {
  router.push('/cms/posts');
}
watch(
  () => route.params.id,
  () => {
    if (route.params.id && typeof route.params.id === 'string') {
      getPostsDetails(route.params.id).then((res) => {
        const { title, content, ...data } = res;
        formApi.setValues({
          title,
          content,
        });
        formApi.updateSchema([
          {
            fieldName: 'title',
            dependencies: {
              if: () => false,
              triggerFields: ['title'],
            },
          },
        ]);
        details.value = data;
      });
    }
  },
  {
    immediate: true,
  },
);
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
