<script setup lang="ts">
import type { AuthApi } from '#/api/login/model';

import { onMounted, ref } from 'vue';

import { getCaptcha } from '#/api/login';

const emit = defineEmits<{
  captchaId: [value: string];
}>();

const modelValue = defineModel<string>({ default: '' });

const data = ref<AuthApi.CaptchaResult>({
  captchaId: '',
  img: '',
});

const loading = ref(false);

const refresh = () => {
  loading.value = true;
  getCaptcha()
    .then((res) => {
      data.value = res;
      emit('captchaId', res.captchaId);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  refresh();
});
</script>
<template>
  <a-input v-model:value="modelValue" placeholder="请输入验证码">
    <template #suffix>
      <a-image
        :preview="false"
        :src="data.img"
        :width="100"
        class="cursor-pointer"
        height="100%"
        @click="refresh"
      />
    </template>
  </a-input>
</template>

<style scoped></style>
