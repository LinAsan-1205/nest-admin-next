<script setup lang="ts">
const { list = [], row = null } = defineProps<{
  list: {
    danger?: boolean;
    onClick: (row: any) => void;
    title: string;
  }[];
  row?: any;
}>();
</script>

<template>
  <a-space :size="12">
    <a-button
      v-for="(item, index) in list"
      :key="index"
      :danger="item.danger"
      class="m-0 p-0"
      type="link"
      @click="() => item.onClick(row)"
    >
      {{ item.title }}
    </a-button>
  </a-space>
</template>

<style scoped></style>
