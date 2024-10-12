<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter';
import {
  createDept,
  type DeptApi,
  getDeptList,
  updateDept,
} from '#/api/system/dept';
import { $t } from '#/locales';

defineOptions({
  name: 'DeptFormModel',
});

const emit = defineEmits<{
  refresh: [];
}>();

const updateTheStatus = ref<boolean>(false);

const deptId = ref<string>();

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
      defaultValue: '',
      formItemClass: 'col-span-2',
      fieldName: 'parentId',
      label: $t('page.dept.parentName'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'deptName',
      label: $t('page.dept.deptName'),
      rules: z.string().min(2, { message: '最少输入2个字符' }),
    },

    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      defaultValue: 0,
      fieldName: 'orderNum',
      label: $t('page.dept.orderNum'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'leader',
      label: $t('page.dept.leader'),
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'phone',
      label: $t('page.dept.phone'),
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
      label: $t('page.dept.status'),
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
      label: $t('page.dept.remark'),
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
        deptId: id,
      } = modalApi.getData<Record<string, any>>();
      // 修改时设置表单值
      if (values) {
        formApi.setValues(values);
      }
      updateTheStatus.value = update;
      deptId.value = update ? id : '';
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  const data = values as DeptApi.CreateParams;
  const messageContent = updateTheStatus.value
    ? $t('page.apiEditSuccess')
    : $t('page.apiCreateSuccess');
  await (updateTheStatus.value
    ? updateDept(deptId.value as string, data)
    : createDept(data));
  message.success(messageContent);
  modalApi.close();
  emit('refresh');
}

onMounted(async () => {
  await getDeptList({}).then((res) => {
    formApi.updateSchema([
      {
        fieldName: 'parentId',
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
