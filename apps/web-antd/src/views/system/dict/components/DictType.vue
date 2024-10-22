<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  deleteDictType,
  type DictTypeApi,
  getDictTypeList,
} from '#/api/system/dict';
import { type SideInstance } from '#/components/Table/Side';
import { $t } from '#/locales';

import DictTypeFormModel from './DictTypeFormModel.vue';

const modelValue = defineModel<null | string>();

const sideRef = useTemplateRef<SideInstance>('side');

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: DictTypeFormModel,
});

const fetch = (searchValue: string) => {
  return getDictTypeList({
    searchValue,
  });
};

const onCreate = () => {
  formModalApi.setState({ title: $t('page.dictType.createType') });
  formModalApi.setData({
    update: false,
  });
  formModalApi.open();
};

const onUpdate = (row: DictTypeApi.Item) => {
  formModalApi.setState({ title: $t('page.dictType.updateType') });
  formModalApi.setData({
    values: {
      ...row,
    },
    update: true,
    dictTypeId: row.dictId,
  });
  formModalApi.open();
};

const onRemove = (row: DictTypeApi.Item) => {
  return deleteDictType(row.dictId);
};

const fetchData = async () => {
  sideRef.value?.fetch();
};
</script>

<template>
  <Side
    ref="side"
    v-model="modelValue"
    :create-request="onCreate"
    :delete-request="onRemove"
    :get-request="fetch"
    :title="$t('page.dictType.dictType')"
    :update-request="onUpdate"
    field-key="dictType"
    field-name="dictName"
    placeholder="请输入名称/编码/描述"
  >
    <template #item="{ row }">
      {{ row.dictName }} ({{ row.dictType }})
    </template>
    <template #footer>
      <a-button type="primary" @click="onCreate">
        {{ $t('modal.add') }}
      </a-button>
    </template>
  </Side>
  <FormModal @refresh="fetchData" />
</template>

<style scoped></style>
