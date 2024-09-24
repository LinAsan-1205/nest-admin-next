<script lang="ts" setup>
import { WorkbenchHeader } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        {{ userStore.userInfo?.userName }}, 欢迎回来！
      </template>
      <template #description> 今日晴，20℃ - 32℃！ </template>
    </WorkbenchHeader>
  </div>
</template>
