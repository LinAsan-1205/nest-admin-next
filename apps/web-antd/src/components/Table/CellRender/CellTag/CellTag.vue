<script setup lang="ts">
import { computed } from 'vue';

import { type CellTagProps } from './index';

const {
  checkedValue,
  checkedText = '显示',
  unCheckedText = '隐藏',
  checkedColor = 'processing',
  unCheckedColor = 'success',
  value,
} = defineProps<{ value: any } & CellTagProps>();
const text = computed(() =>
  value === checkedValue ? checkedText : unCheckedText,
);
const color = computed(() =>
  value === checkedValue ? checkedColor : unCheckedColor,
);
</script>

<template>
  <a-tag :color="color">{{ text }}</a-tag>
</template>

<style scoped></style>
