<script setup lang="ts">
import { h } from 'vue';

import { Image } from 'ant-design-vue';

import { type AttachmentApi } from '#/api/system/attachment';

const props = defineProps<{
  row: AttachmentApi.Item;
}>();
const createComponent = () => {
  const { url: src } = props.row;
  if (props.row.mimeType.includes('image')) {
    return h(Image, {
      src,
      width: 80,
      height: 80,
    });
  }
  return h('div', '暂不支持预览');
};
</script>

<template>
  <component :is="createComponent()" />
</template>

<style scoped></style>
