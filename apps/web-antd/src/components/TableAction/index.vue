<script setup lang="ts">
import { computed } from 'vue';

const {
  list = [],
  row = null,
  type = 'table',
} = defineProps<{
  list: {
    danger?: boolean;
    onClick: (row: any) => void;
    title: string;
    type?: string;
  }[];
  row?: any;
  type?: 'table' | 'toolbar';
}>();
const buttonClassName = computed(() => (type === 'table' ? 'm-0 p-0' : ''));
</script>

<template>
  <a-space :size="12">
    <a-button
      v-for="(item, index) in list"
      :key="index"
      :class="buttonClassName"
      :danger="item.danger"
      :type="item.type ?? 'link'"
      @click="() => item.onClick(row)"
    >
      {{ item.title }}
    </a-button>
  </a-space>
</template>

<style scoped></style>
