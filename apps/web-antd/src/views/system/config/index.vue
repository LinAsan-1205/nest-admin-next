<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { Page } from '@vben/common-ui';

import Form from './components/Form.vue';
import Group from './components/Group.vue';

const groupRef = useTemplateRef<InstanceType<typeof Group>>('group');

const onRefresh = () => {
  groupRef.value?.fetchConfig();
};
</script>

<template>
  <Page title="系统配置">
    <div class="flex gap-4">
      <Group ref="group" />
      <Form @refresh="onRefresh" />
    </div>
  </Page>
</template>

<style scoped></style>
