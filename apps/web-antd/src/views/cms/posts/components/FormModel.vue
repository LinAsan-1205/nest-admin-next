<script lang="ts" setup>
import type { PostsApi } from '#/api/cms/posts';

import { useVbenForm } from '#/adapter/form';
import { queryAllList } from '#/api/cms/category';
import { createPosts, updatePosts } from '#/api/cms/posts';
import { $t } from '#/locales';
import { useVbenModal, z } from '@vben/common-ui';
import { message } from 'ant-design-vue';
import { onMounted, ref } from 'vue';

defineOptions({
  name: 'CmsCategoryFormModel',
});

const emit = defineEmits<{
  refresh: [];
}>();

const updateTheStatus = ref<boolean>(false);

const id = ref<string>();
const content = ref<string>('');

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
        maxCount: 1,
        name: 'file',
      },
      fieldName: 'cover',
      label: $t('cms_posts.cover'),
      rules: 'required',
      formItemClass: 'col-span-2',
      dependencies: {
        show(values) {
          return values.template === 'article';
        },
        triggerFields: ['template'],
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'title',
      label: $t('cms_posts.title'),
      rules: 'required',
      formItemClass: 'col-span-2',
      dependencies: {
        show(values) {
          return values.template === 'article';
        },
        triggerFields: ['template'],
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'alias',
      label: $t('cms_posts.alias'),
      help: '通常用于生成文章的固定链接',
      formItemClass: 'col-span-2',
      rules: z.string().refine(
        async (alias) => {
          const checkUsernameExists = async (
            alias: string,
          ): Promise<boolean> => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return !/^[a-z]+$/i.test(alias);
          };
          const exists = await checkUsernameExists(alias);
          return !exists;
        },
        {
          message: '别名只能包含字母',
        },
      ),
    },

    {
      component: 'Select',
      componentProps: {
        placeholder: '请输入',
        mode: 'multiple',
      },
      fieldName: 'category',
      label: $t('cms_posts.category'),
      rules: 'required',
      formItemClass: 'col-span-2',
      dependencies: {
        show(values) {
          return values.template === 'article';
        },
        triggerFields: ['template'],
      },
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'posts_template',
        placeholder: '请选择',
      },
      defaultValue: 'article',
      fieldName: 'template',
      label: $t('cms_posts.template'),
      formItemClass: 'col-span-2',
      help: '用户对应不同的模板页面',
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'posts_commentsAreAllowed',
        placeholder: '请选择',
        componentName: 'radio',
      },
      defaultValue: '0',
      fieldName: 'commentsAreAllowed',
      label: $t('cms_posts.commentsAreAllowed'),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'posts_pinnedOrNot',
        placeholder: '请选择',
        componentName: 'radio',
      },
      defaultValue: '1',
      fieldName: 'pinnedOrNot',
      label: $t('cms_posts.pinnedOrNot'),
      dependencies: {
        show(values) {
          return values.template === 'article';
        },
        triggerFields: ['template'],
      },
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'posts_visibility',
        placeholder: '请选择',
        componentName: 'radio',
      },
      defaultValue: '0',
      fieldName: 'visibility',
      label: $t('cms_posts.visibility'),
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
      label: $t('cms_posts.status'),
    },
    {
      component: 'DatePicker',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'publicationTime',
      label: $t('cms_posts.publicationTime'),
      rules: 'required',
      formItemClass: 'col-span-2',
      dependencies: {
        show(values) {
          return values.template === 'article';
        },
        triggerFields: ['template'],
      },
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
        id: postsId,
      } = modalApi.getData<Record<string, any>>();
      if (values) {
        content.value = values.content;
        formApi.setValues(values);
      }
      updateTheStatus.value = update;
      id.value = update ? postsId : '';
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  const data = {
    ...values,
    content: content.value,
  } as PostsApi.CreateParams;
  const messageContent = updateTheStatus.value
    ? $t('api.editSuccess')
    : $t('api.createSuccess');
  await (updateTheStatus.value
    ? updatePosts(id.value as string, data)
    : createPosts(data));
  message.success(messageContent);
  modalApi.close();
  emit('refresh');
}

onMounted(() => {
  queryAllList().then((res) => {
    formApi.updateSchema([
      {
        fieldName: 'category',
        componentProps: {
          options: res.map((item) => ({
            label: item.name,
            value: item.categoryId,
          })),
        },
      },
    ]);
  });
});
</script>
<template>
  <Modal class="md:w-[1000px]">
    <Form />
  </Modal>
</template>
