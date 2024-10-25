<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import {
  type ConfigGroupModelApi,
  type ConfigModelApi,
  getConfigGroupList,
  getConfigurationBasedOnGrouping,
} from '#/api/system/config';

const modelValue = defineModel<string>();
const data = ref<ConfigGroupModelApi.List>([]);
const formData = ref<ConfigModelApi.List>([]);
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

onMounted(() => {
  fetch();
});

watch(modelValue, (value: string) => {
  getConfigurationBasedOnGrouping(value).then((res) => {
    formData.value = res;
  });
});
</script>

<template>
  <a-card
    :body-style="{ padding: '10px', width: '100%' }"
    :bordered="false"
    class="mb-4 h-full flex-1 md:mb-0"
  >
    <div class="flex flex-col">
      <a-segmented
        v-model:value="modelValue"
        :options="segmentedOptions"
        class="mb-4"
      />
    </div>
  </a-card>
</template>

<style scoped></style>
