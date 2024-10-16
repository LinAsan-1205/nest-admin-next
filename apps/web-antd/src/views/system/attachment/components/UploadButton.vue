<script setup lang="ts">
import type { UploadChangeParam } from 'ant-design-vue';

import { computed, ref } from 'vue';

import { useAccessStore } from '@vben/stores';

import { message } from 'ant-design-vue';

import { apiURL } from '#/api/core/request';

const { classifyId } = defineProps<{
  classifyId: string;
}>();

const emit = defineEmits<{
  change: [];
}>();

const fileList = ref([]);

const accessStore = useAccessStore();

const action = computed(() => `${apiURL}/upload/multiple`);

const data = computed(() => {
  return {
    classifyId,
  };
});
const headers = {
  Authorization: `Bearer ${accessStore.accessToken}`,
};

const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'done') {
    message.success(`${info.file.name}:上传成功`);
    emit('change');
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name}:上传失败`);
  }
};
</script>

<template>
  <a-upload
    v-model:file-list="fileList"
    :action="action"
    :data="data"
    :headers="headers"
    :show-upload-list="false"
    name="files"
    @change="handleChange"
  >
    <a-button class="mr-4" type="primary">
      <div class="flex items-center">上传文件</div>
    </a-button>
  </a-upload>
</template>

<style scoped></style>
