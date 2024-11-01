<script setup lang="ts">
import type { UploadProps } from 'ant-design-vue';

import { computed } from 'vue';

import { useAccessStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { message } from 'ant-design-vue';

import { apiURL } from '#/api/core/request';

import { checkFileType } from './helper';

interface UploadFileProps {
  maxCount?: number;
  maxSize?: number;
  helpText?: string;
  accept?: string[];
  name?: string;
  disabled?: boolean;
}

const {
  maxCount = 5,
  helpText = '请上传',
  accept = ['png', 'jpg', 'jpeg'],
  maxSize = 5,
  name = 'file',
  disabled = false,
} = defineProps<UploadFileProps>();

const action = `${apiURL}/upload/singleFile`;

const modelValue = defineModel<UploadProps['fileList']>({
  default: () => [],
});

const accessStore = useAccessStore();

const headers = computed(() => {
  return {
    Authorization: `Bearer ${accessStore.accessToken}`,
  };
});

const showUploadIcon = computed(() => {
  if (!modelValue.value) {
    return false;
  }
  return modelValue.value.length < maxCount;
});

const beforeUpload = (file: File) => {
  const isFile = checkFileType(file, accept);
  if (!isFile) {
    message.error(`只能上传 ${accept.join(', ')} 格式的文件!`);
  }
  const isLt2M = file.size / 1024 / 1024 < maxSize;
  if (!isLt2M) {
    message.error(`文件大小不能超过 ${maxSize}MB!`);
  }
  return isFile && isLt2M;
};

const handlePreview = async (file: any) => {
  openWindow(file.url || file.response, {
    target: '_blank',
  });
};

const handleChange = (info: any) => {
  if (info.file.status === 'error') {
    message.error(`${info.file.name} 上传失败`);
  }
};
</script>

<template>
  <div class="flex">
    <a-upload
      v-model:file-list="modelValue"
      :action="action"
      :before-upload="beforeUpload"
      :disabled="disabled"
      :headers="headers"
      :max-count="maxCount"
      :name
      list-type="picture-card"
      @change="handleChange"
      @preview="handlePreview"
    >
      <div v-if="showUploadIcon">
        <div class="mt-4 text-sm">{{ helpText }}</div>
      </div>
    </a-upload>
  </div>
</template>

<style scoped lang="scss"></style>
