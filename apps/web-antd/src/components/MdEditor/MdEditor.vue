<script setup lang="ts">
import { MdEditor as MdEditorV3 } from 'md-editor-v3';

import 'md-editor-v3/lib/style.css';

defineOptions({
  name: 'MdEditor',
  inheritAttrs: false,
});
const modelValue = defineModel<string>('value', {
  default: '',
});
</script>

<template>
  <MdEditorV3 v-model="modelValue" class="md-editor" />
</template>

<style lang="scss" scoped>
.md-editor * {
  box-sizing: content-box !important;
}
</style>
