<script setup lang="ts">
import type { UploadProps } from 'ant-design-vue';
import type { UploadRequestOption } from 'ant-design-vue/lib/vc-upload/interface';

import { computed, ref } from 'vue';

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

const {
  maxCount = 5,
  helpText = '请上传',
  accept = ['png', 'jpg', 'jpeg'],
  maxSize = 5,
  name = 'file',
  disabled = false,
} = defineProps<UploadFileProps>();

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
  openWindow(file.url || file.response, {
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

  if (info.file.status === 'done') {
    message.success(`${info.file.name} 文件上传成功`);
  }

  if (info.file.status === 'error') {
    message.error(`${info.file.name} 文件上传失败`);
  }
};

// TODO 这个函数需要重新优化一下 还有点问题 不够完美
const customRequest = async (file: UploadRequestOption<any>) => {
  const formData = new FormData();
  formData.append(name, file.file);

  const fileList: any = modelValue.value;
  let fileItem = fileList.find(
    (item: any) => item.uid === (file.file as any).uid,
  );

  if (fileItem) {
    fileItem.status = 'uploading';
  } else {
    fileItem = {
      uid: (file.file as any).uid,
      name: (file.file as any).name,
      status: 'uploading',
      url: '',
    };
    fileList.push(fileItem);
  }

  try {
    const data = await uploadASingleFile(formData);
    fileItem.status = 'done';
    fileItem.url = `${apiURL}/${data.url}`;
    file.onSuccess?.(fileItem.url);
    modelValue.value = modelValue.value?.map((item: any) => ({
      url: fileItem.url,
      uid: fileItem.uid,
      response: fileItem.url,
      status: (file.file as any).name === item.name ? 'done' : item.status,
      name: item.name,
    }));
  } catch (error: any) {
    file.onError?.(error);
  }
};
</script>

<template>
  <div class="flex">
    <a-upload
      v-model:file-list="modelValue"
      :before-upload="beforeUpload"
      :custom-request="customRequest"
      :disabled="disabled"
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
