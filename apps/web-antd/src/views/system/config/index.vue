<script setup lang="ts">
import { Page } from '@vben/common-ui';

import Form from './components/Form.vue';
import Group from './components/Group.vue';
</script>

<template>
  <Page title="系统配置">
    <div class="flex gap-4">
      <Group />
      <Form />
    </div>
  </Page>
</template>

<style scoped></style>
