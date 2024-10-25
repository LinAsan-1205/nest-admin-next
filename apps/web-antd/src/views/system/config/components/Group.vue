<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { useVbenForm } from '#/adapter/form';
import {
  type ConfigGroupModelApi,
  getConfigGroupList,
  getConfigurationBasedOnGrouping,
} from '#/api/system/config';

const modelValue = defineModel<string>();
const data = ref<ConfigGroupModelApi.List>([]);

const [Form, formApi] = useVbenForm({
  wrapperClass: 'grid-cols-1',
});
const segmentedOptions = computed(() =>
  data.value.flatMap((item) => ({
    label: item.groupName,
    value: item.groupId,
  })),
);

const fetch = () => {
  getConfigGroupList().then((res) => {
    data.value = res;
    modelValue.value = res[0]?.groupId;
  });
};

const fetchConfig = () => {
  getConfigurationBasedOnGrouping(modelValue.value).then((res) => {
    formApi.setState((_) => {
      return {
        schema: res.flatMap((item) => {
          return {
            component: item.inputType.replace(/^./, (char) =>
              char.toUpperCase(),
            ),
            componentProps: {
              placeholder: '请输入',
            },
            help: item.key,
            fieldName: item.key,
            label: item.name,
          };
        }),
      };
    });
  });
};

onMounted(() => {
  fetch();
});

watch(modelValue, () => {
  fetchConfig();
});
</script>

<template>
  <a-card
    :body-style="{ padding: '10px', width: '100%' }"
    :bordered="false"
    class="mb-4 h-full flex-1 md:mb-0"
  >
    <div class="mb-4 flex w-full justify-end gap-x-4">
      <a-button type="primary">新增组</a-button>
      <a-button type="primary">组配置</a-button>
    </div>
    <div v-if="segmentedOptions.length > 0" class="flex flex-col">
      <a-segmented
        v-model:value="modelValue"
        :options="segmentedOptions"
        class="mb-4"
      />
      <Form />
    </div>
  </a-card>
</template>

<style scoped></style>
