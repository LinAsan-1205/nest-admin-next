<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';

import { type DictDataApi, getDictDataFieldList } from '#/api/system/dict';

const { placeholder = '请选择', dictType } = defineProps<{
  dictType: string;
  placeholder?: string;
}>();

const modelValue = defineModel<null | string>('value');

const dictData = ref<DictDataApi.List>([]);

const select = useTemplateRef('select');

const fetch = () => {
  getDictDataFieldList({ dictType }).then((res) => {
    dictData.value = res;
  });
};

onMounted(() => {
  fetch();
});
</script>

<template>
  <a-select ref="select" v-model:value="modelValue" :placeholder>
    <a-select-option
      v-for="item in dictData"
      :key="item.dictCode"
      :value="item.dictValue"
    >
      {{ item.dictLabel }}
    </a-select-option>
  </a-select>
</template>

<style scoped></style>
