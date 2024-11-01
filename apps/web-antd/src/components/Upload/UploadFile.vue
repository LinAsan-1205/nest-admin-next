<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useAccessStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { message, Upload } from 'ant-design-vue';
import { type UploadFile } from 'ant-design-vue/es/upload/interface';

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

const modelValue = defineModel<string>({
  default: () => '',
});

const dataList = ref<UploadFile[]>([]);

function getInitialValue(value: UploadFile[]) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return '';
  }
  if (value.length === 1 && value[0]) {
    return value[0].url as string;
  }
  return value.map((item) => item.url as string).join(',');
}

const fileList = computed({
  get: () => dataList.value,
  set: (value) => {
    modelValue.value = getInitialValue(value);
    dataList.value = value;
  },
});

const accessStore = useAccessStore();

const headers = computed(() => {
  return {
    Authorization: `Bearer ${accessStore.accessToken}`,
  };
});

const showUploadIcon = computed(() => {
  if (!fileList.value) {
    return false;
  }
  return fileList.value.length < maxCount;
});

// TODO 上传之前需要做压缩
const beforeUpload = (file: File) => {
  const isFile = checkFileType(file, accept);
  if (!isFile) {
    message.error(`只能上传 ${accept.join(', ')} 格式的文件!`);
    return Upload.LIST_IGNORE;
  }
  const isLt2M = file.size / 1024 / 1024 < maxSize;
  if (!isLt2M) {
    message.error(`文件大小不能超过 ${maxSize}MB!`);
    return Upload.LIST_IGNORE;
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

const handleRemove = (file: UploadFile) => {
  const index = dataList.value.findIndex((item) => item.uid === file.uid);
  if (index !== -1) {
    dataList.value.splice(index, 1);
    return true;
  }
  return false;
};

watch(
  () => modelValue.value,
  (value) => {
    if (value) {
      dataList.value = Array.isArray(value)
        ? value.map((url) => ({ url, name: url, uid: url }))
        : [{ url: value, uid: value, name: value }];
    } else {
      dataList.value = [];
    }
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <div class="flex">
    <a-upload
      v-model:file-list="fileList"
      :action="action"
      :before-upload="beforeUpload"
      :disabled="disabled"
      :headers="headers"
      :max-count="maxCount"
      :name
      list-type="picture-card"
      @change="handleChange"
      @preview="handlePreview"
      @remove="handleRemove"
    >
      <div v-if="showUploadIcon">
        <div class="mt-4 text-sm">{{ helpText }}</div>
      </div>
    </a-upload>
  </div>
</template>

<style scoped lang="scss"></style>
