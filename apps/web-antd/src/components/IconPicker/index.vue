<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

import { IconPicker } from '@vben/common-ui';
import { listIcons } from '@vben/icons';

import { Input, type SelectProps } from 'ant-design-vue';

import iconsData from './icons.data';

export interface Props {
  allowClear?: boolean;
  pageSize?: number;
  /**
   * 可以通过prefix获取系统中使用的图标集
   */
  prefix?: string;
  readonly?: boolean;
  value?: string;
  width?: string;
  placeholder?: string;
}

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<Props>(), {
  allowClear: true,
  pageSize: 36,
  prefix: '',
  readonly: false,
  value: '',
  width: '100%',
  placeholder: '点击选中图标',
});

const modelValue = defineModel<string>('value');

const selectedPrefix = ref('');

const prefixOptions = ref<SelectProps['options']>([
  {
    value: 'ant-design',
    label: 'ant-design',
  },
  {
    value: 'svg',
    label: 'svg',
  },
]);

const refIconPicker = ref();

const currentList = computed(() => {
  try {
    if (selectedPrefix.value) {
      const icons = listIcons('', selectedPrefix.value);
      if (icons.length === 0) {
        console.warn(`No icons found for prefix: ${selectedPrefix.value}`);
      }
      return icons;
    } else {
      const prefix = iconsData.prefix;
      return iconsData.icons.map((icon) => `${prefix}:${icon}`);
    }
  } catch (error) {
    console.error('Failed to load icons:', error);
    return [];
  }
});

const triggerPopover = () => {
  refIconPicker.value?.changeOpenState?.();
};

const handleChange = (icon: string) => {
  modelValue.value = icon;
};
const handlePrefixChange = (val: string) => {
  selectedPrefix.value = val;
};

watch(
  () => props.prefix,
  (val) => {
    selectedPrefix.value = val;
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <Input
    v-model:value="modelValue"
    :allow-clear="props.allowClear"
    :placeholder="props.placeholder"
    :readonly="props.readonly"
    :style="{ width }"
    class="cursor-pointer"
    @click="triggerPopover"
  >
    <template #addonBefore>
      <a-select
        v-model:value="selectedPrefix"
        :options="prefixOptions"
        class="w-[100px]"
        placeholder="请选择图标集"
        @change="handlePrefixChange"
      />
    </template>
    <template #addonAfter>
      <IconPicker
        ref="refIconPicker"
        :icons="currentList"
        :page-size="pageSize"
        :value="modelValue"
        @change="handleChange"
      />
    </template>
  </Input>
</template>
