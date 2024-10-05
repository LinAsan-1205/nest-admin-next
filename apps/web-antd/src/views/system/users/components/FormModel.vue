<script lang="ts" setup>
import { h, onMounted, ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { type DeptApi, getDeptList } from '#/api/system/dept';
import { $t } from '#/locales';

import UploadAvatar from './UploadAvatar.vue';

defineOptions({
  name: 'UserFormModel',
});

function onSubmit(values: Record<string, any>) {
  message.info(JSON.stringify(values));
}

const deptList = ref<DeptApi.List[]>([]);

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
      component: 'Upload',
      componentProps: {
        placeholder: '请输入',
        name: 'avatar',
        fileList: [],
        listType: 'picture-card',
      },
      formItemClass: 'col-span-2',
      fieldName: 'avatar',
      label: $t('page.users.avatar'),
      renderComponentContent: () => {
        return {
          default: () => [h(UploadAvatar)],
        };
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'userName',
      label: $t('page.users.userName'),
      rules: z.string().min(4, { message: '最少输入4个字符' }),
    },
    {
      component: 'TreeSelect',
      componentProps: {
        placeholder: '请输入',
        treeData: [],
        fieldNames: {
          children: 'children',
          label: 'deptName',
          value: 'deptId',
        },
      },
      fieldName: 'deptId',
      label: $t('page.users.dept'),
      rules: 'required',
    },
    {
      component: 'InputPassword',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'password',
      label: $t('page.users.password'),
      rules: z.string().min(6, { message: '最少输入6个字符' }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'nickName',
      label: $t('page.users.nickName'),
      rules: z.string().min(2, { message: '最少输入2个字符' }).optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'phone',
      label: $t('page.users.phone'),
      rules: z
        .string()
        .min(11, { message: '手机号格式不正确' })
        .max(11, { message: '手机号最大为11位数' })
        .refine((value) => /^1[3-9]\d{9}$/.test(value), {
          message: '手机号格式不正确',
        })
        .optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'email',
      label: $t('page.users.email'),
      rules: z.string().email('请输入正确的邮箱').optional(),
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
      label: $t('page.users.status'),
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
      label: $t('page.users.remark'),
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
    await formApi.submitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { values } = modalApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
      }
    }
  },
});

onMounted(async () => {
  await getDeptList({}).then((res) => {
    deptList.value = res;
    formApi.updateSchema([
      {
        fieldName: 'deptId',
        componentProps: {
          treeData: res,
        },
      },
    ]);
  });
});
</script>
<template>
  <Modal class="md:w-[800px]">
    <Form />
  </Modal>
</template>
