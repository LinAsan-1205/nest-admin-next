<script setup lang="ts">
import { onMounted, onUnmounted, toRaw, useAttrs, useTemplateRef } from 'vue';

import { usePreferences } from '@vben/preferences';

import * as monaco from 'monaco-editor';

defineOptions({
  name: 'MonacoEditor',
  inheritAttrs: false,
});

const { language = 'json' } = defineProps<{
  language: string;
}>();

const emit = defineEmits(['update:value']);
const attrs = useAttrs();
const editorContainer = useTemplateRef('editorContainer');
let instance: any;
const modelValue = defineModel('value');
const { isDark } = usePreferences();
onMounted(() => {
  setTimeout(() => {
    if (editorContainer.value) {
      instance = monaco.editor.create(editorContainer.value as any, {
        tabSize: 2,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        language,
        theme: isDark.value ? 'vs-dark' : 'vs',
        colorDecorators: true,
        minimap: { enabled: false },
        folding: true,
        acceptSuggestionOnCommitCharacter: true,
        contextmenu: true,
        overviewRulerBorder: true,
        autoClosingBrackets: 'always',
        autoClosingDelete: 'always',
        autoClosingQuotes: 'always',
      });
      instance.setValue(modelValue.value);
      instance.onDidChangeModelContent(() => {
        emit('update:value', toRaw(instance.getValue()));
      });
    }
  }, 100);
});

onUnmounted(() => {
  if (instance) {
    instance.dispose();
  }
});
</script>

<template>
  <div
    v-bind="attrs"
    ref="editorContainer"
    class="monaco-editor-container"
  ></div>
</template>

<style scoped>
.monaco-editor-container {
  width: 100%;
  overflow: hidden;
}
</style>
