<script setup lang="ts">
import { computed, h } from 'vue';

import { Image } from 'ant-design-vue';

import { type AttachmentApi } from '#/api/system/attachment';

const props = defineProps<{
  row: AttachmentApi.Item;
}>();
const createComponent = computed(() => {
  const { url: src } = props.row;
  if (props.row.mimeType.includes('image')) {
    return h(Image, {
      src,
      width: 60,
      height: 60,
    });
  }
  return h('div', '暂不支持预览');
});
</script>

<template>
  <div class="flex justify-center">
    <component :is="createComponent" />
  </div>
</template>

<style scoped></style>
