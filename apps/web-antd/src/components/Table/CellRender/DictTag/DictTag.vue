<script setup lang="ts">
import { computed } from 'vue';

import { useDictDataStore } from '#/store';

import { type DictTagProps } from './index';

const { dictType, value } = defineProps<DictTagProps>();
const { allFields } = useDictDataStore();
const TagInfo = computed(() => {
  const data = allFields[dictType] || [];
  return data?.find((item) => item.dictValue === value);
});

const textValue = computed(() => TagInfo.value?.dictLabel);
const colorValue = computed(() => TagInfo.value?.color);
</script>

<template>
  <a-tag :color="colorValue">{{ textValue }}</a-tag>
</template>

<style scoped></style>
