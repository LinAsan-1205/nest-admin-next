<script lang="ts" setup>
import type { UploadProps } from 'ant-design-vue';

import { onMounted, ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import { getDeptList } from '#/api/system/dept';
import { createUser, updateUser, type UserApi } from '#/api/system/user';
import { $t } from '#/locales';

defineOptions({
  name: 'UserFormModel',
});

const emit = defineEmits<{
  refresh: [];
}>();

const updateTheStatus = ref<boolean>(false);

const userId = ref<string>();

const avatar = ref<UploadProps['fileList']>([]);

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
      },
      formItemClass: 'col-span-2',
      fieldName: 'avatar',
      label: $t('page.users.avatar'),
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
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'nickName',
      label: $t('page.users.nickName'),
      rules: z.string().min(2, { message: '最少输入2个字符' }),
    },
    {
      component: 'InputPassword',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'password',
      label: $t('page.users.password'),
      rules: z.string().min(6, { message: '密码长度不能小于6位' }),
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
        .nullable()
        .optional(),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'email',
      label: $t('page.users.email'),
      rules: z.string().email('请输入正确的邮箱').nullable().optional(),
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_user_sex',
        placeholder: '请选择状态',
        componentName: 'radio',
      },
      defaultValue: '0',
      fieldName: 'sex',
      label: $t('page.users.sex'),
      rules: 'selectRequired',
    },
    {
      component: 'DictData',
      componentProps: {
        dictType: 'sys_user_status',
        placeholder: '请选择状态',
        componentName: 'radio',
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

const setAvatar = (url: string) => {
  if (!url) return;
  avatar.value = [
    {
      uid: '-1',
      name: 'avatar.png',
      url,
    },
  ];
};

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
        userId: id,
      } = modalApi.getData<Record<string, any>>();
      updateTheStatus.value = update;
      // 修改时设置表单值
      if (values) {
        formApi.setValues({
          ...values,
          password: null,
        });
        setAvatar(values.avatar);
      }
      userId.value = update ? id : '';
      const passwordRule = z
        .string()
        .min(6, { message: '密码长度不能小于6位' });
      if (update) {
        formApi.updateSchema([
          {
            fieldName: 'password',
            rules: passwordRule.nullable().optional(),
          },
        ]);
      } else {
        formApi.updateSchema([
          {
            fieldName: 'password',
            rules: passwordRule,
          },
        ]);
      }
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  const data = values as UserApi.CreateParams;
  const params = {
    ...data,
    avatar: avatar.value?.[0]?.url,
  };
  const messageContent = updateTheStatus.value
    ? $t('page.apiEditSuccess')
    : $t('page.apiCreateSuccess');
  await (updateTheStatus.value
    ? updateUser(userId.value as string, params)
    : createUser(params));
  message.success(messageContent);
  modalApi.close();
  emit('refresh');
}

onMounted(async () => {
  await getDeptList({}).then((res) => {
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
    <Form>
      <template #avatar>
        <UploadFile v-model="avatar" :max-count="1" />
      </template>
    </Form>
  </Modal>
</template>
