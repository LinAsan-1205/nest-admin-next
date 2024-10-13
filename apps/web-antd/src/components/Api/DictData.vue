<script setup lang="ts">
import { h, onMounted, ref, useAttrs, useTemplateRef } from 'vue';

import { Radio, RadioGroup, Select } from 'ant-design-vue';

import { type DictDataApi, getDictDataFieldList } from '#/api/system/dict';

defineOptions({
  name: 'DictData',
  inheritAttrs: false,
});

const {
  placeholder = '请选择',
  dictType,
  componentName = 'select',
} = defineProps<{
  componentName?: 'radio' | 'select';
  dictType: string;
  placeholder?: string;
}>();

const attrs = useAttrs();

const components = {
  select: Select,
  radio: RadioGroup,
};

const modelValue = defineModel<null | string>('value');

const dictData = ref<DictDataApi.List>([]);

const selectRef = useTemplateRef('select');

const renderSlots = () => {
  switch (componentName) {
    case 'select': {
      return dictData.value.map((item) =>
        h(
          Select.Option,
          { value: item.dictValue },
          {
            default: () => item.dictLabel,
          },
        ),
      );
    }
    case 'radio': {
      return dictData.value.map((item) =>
        h(
          Radio,
          { value: item.dictValue },
          {
            default: () => item.dictLabel,
          },
        ),
      );
    }
    default: {
      return [];
    }
  }
};

const fetch = () => {
  getDictDataFieldList({ dictType }).then((res) => {
    dictData.value = res;
  });
};

onMounted(() => {
  fetch();
});
</script>

<template>
  <component
    v-bind="attrs"
    :is="components[componentName]"
    ref="selectRef"
    v-model:value="modelValue"
    :placeholder="placeholder"
  >
    <component :is="item" v-for="(item, index) in renderSlots()" :key="index" />
  </component>
  <!--  <a-select ref="select" v-model:value="modelValue" :placeholder>-->
  <!--    <a-select-option-->
  <!--      v-for="item in dictData"-->
  <!--      :key="item.dictCode"-->
  <!--      :value="item.dictValue"-->
  <!--    >-->
  <!--      {{ item.dictLabel }}-->
  <!--    </a-select-option>-->
  <!--  </a-select>-->
</template>

<style scoped></style>
