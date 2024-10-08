<script setup lang="ts">
import type { UploadProps } from 'ant-design-vue';
import type { UploadRequestOption } from 'ant-design-vue/lib/vc-upload/interface';

import { computed, defineProps, ref } from 'vue';

import { LoadingOutlined } from '@vben/icons';
import { openWindow } from '@vben/utils';

import { message } from 'ant-design-vue';

import { apiURL } from '#/api/core/request';
import { uploadASingleFile } from '#/api/system/upload';

import { checkFileType } from './helper';

interface UploadFileProps {
  maxCount?: number;
  maxSize?: number;
  helpText?: string;
  accept?: string[];
  name?: string;
  disabled?: boolean;
}

const { maxCount, helpText, accept, maxSize, name } = withDefaults(
  defineProps<UploadFileProps>(),
  {
    maxCount: 5,
    helpText: '请上传',
    accept: () => ['png', 'jpg', 'jpeg'],
    maxSize: 5,
    name: 'file',
    disabled: false,
  },
);
const emit = defineEmits<{
  change: [UploadProps['fileList']];
}>();

const modelValue = defineModel<UploadProps['fileList']>({
  default: () => [],
});

const loading = ref(false);

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
  openWindow(file.url, {
    target: '_blank',
  });
};

const handleChange = (info: any) => {
  if (info.file.status === 'uploading') {
    loading.value = true;
  }

  if (info.file.status === 'done' || info.file.status === 'error') {
    loading.value = false;
  }

  if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
};

const customRequest = async (file: UploadRequestOption<any>) => {
  const formData = new FormData();
  formData.append(name, file.file);

  const fileList: any[] = modelValue.value;
  let fileItem = fileList.find((item) => item.uid === (file.file as any).uid);

  if (fileItem) {
    fileItem.status = 'uploading';
  } else {
    fileItem = {
      uid: (file.file as any).uid,
      name: file.file.name,
      status: 'uploading',
    };
    fileList.push(fileItem);
  }

  try {
    const data = await uploadASingleFile(formData);
    fileItem.status = 'done';
    fileItem.url = `${apiURL}/${data.url}`;
    file.onSuccess?.(data.url);
  } catch (error: any) {
    file.onError?.(error);
  }

  emit('change', modelValue.value);
};
</script>

<template>
  <div class="flex">
    <a-upload
      v-model:file-list="modelValue"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      :max-count="maxCount"
      list-type="picture-card"
      @change="handleChange"
      @preview="handlePreview"
    >
      <div v-if="showUploadIcon">
        <LoadingOutlined v-if="loading" />
        <div class="mt-4 text-sm">{{ helpText }}</div>
      </div>
    </a-upload>
  </div>
</template>

<style scoped></style>
