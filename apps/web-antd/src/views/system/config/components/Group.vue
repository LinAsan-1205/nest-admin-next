<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import {
  type ConfigGroupModelApi,
  getConfigGroupList,
} from '#/api/system/config';

const modelValue = defineModel<string>();
const data = ref<ConfigGroupModelApi.List>([]);

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
</script>

<template>
  <a-card
    :body-style="{ padding: '10px', width: '100%' }"
    :bordered="false"
    class="mb-4 h-full flex-1 md:mb-0"
  >
    <div class="flex flex-col">
      <a-segmented v-model:value="modelValue" :options="segmentedOptions" />
    </div>
  </a-card>
</template>

<style scoped></style>
