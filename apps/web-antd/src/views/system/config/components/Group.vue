<script setup lang="ts">
const modelValue = defineModel<string>();
const data = [
  { label: '标签1', value: '1' },
  { label: '标签2', value: '2' },
  { label: '标签3', value: '3' },
];
</script>

<template>
  <a-card
    :body-style="{ padding: '10px', width: '100%' }"
    :bordered="false"
    class="mb-4 h-full flex-1 md:mb-0"
  >
    <a-segmented v-model:value="modelValue" :options="data" />
  </a-card>
</template>

<style scoped></style>
