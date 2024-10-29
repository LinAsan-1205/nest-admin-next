<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  type ClassifyApi,
  deleteClassify,
  getClassifyList,
} from '#/api/system/attachment';
import { type SideInstance } from '#/components/Table/Side';
import { $t } from '#/locales';

import ClassifyFormModel from './ClassifyFormModel.vue';

const modelValue = defineModel<null | string>();

const sideRef = useTemplateRef<SideInstance>('side');

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: ClassifyFormModel,
});

const fetch = (value: string) => {
  return getClassifyList({
    searchValue: value,
  });
};

const onCreate = () => {
  formModalApi.setState({ title: $t('attachment.createClassify') });
  formModalApi.setData({
    update: false,
  });
  formModalApi.open();
};

const onUpdate = (row: ClassifyApi.Item) => {
  formModalApi.setState({ title: $t('attachment.updateClassify') });
  formModalApi.setData({
    values: {
      ...row,
    },
    update: true,
    classifyId: row.classifyId,
  });
  formModalApi.open();
};

const fetchData = async () => {
  sideRef.value?.fetch();
};

const onRemove = (row: ClassifyApi.Item) => {
  return deleteClassify(row.classifyId);
};
</script>

<template>
  <Side
    ref="side"
    v-model="modelValue"
    :create-request="onCreate"
    :delete-request="onRemove"
    :get-request="fetch"
    :title="$t('attachment.classify')"
    :update-request="onUpdate"
    field-key="classifyId"
    field-name="classifyName"
    placeholder="请输入名称/描述"
  >
    <template #footer>
      <a-button type="primary" @click="onCreate">
        {{ $t('modal.add') }}
      </a-button>
    </template>
  </Side>
  <FormModal @refresh="fetchData" />
</template>

<style scoped></style>
