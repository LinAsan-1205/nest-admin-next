<script setup lang="ts">
import { computed, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import { $t } from '#/locales';

const bordered = false;

const bodyStyle = {
  padding: 0,
};

const { userInfo } = useUserStore();

const avatar = computed({
  get: () => userInfo?.avatar,
  set: (value) => {
    if (value && userInfo) {
      userInfo.avatar = value;
    }
  },
});

const segmented = ref('basic');
const segmentedData = ref([
  {
    label: $t('users.profile.basic_information'),
    value: 'basic',
  },
  {
    label: $t('users.profile.security_settings'),
    value: 'security',
  },
  {
    label: $t('users.profile.third_party_accounts'),
    value: 'accounts',
  },
]);
</script>

<template>
  <Page
    :description="$t('users.profile.description')"
    :title="$t('users.profile.title')"
  >
    <div class="flex flex-col gap-4 md:flex-row">
      <a-card :body-style="bodyStyle" :bordered class="md:basis-1/4">
        <div class="flex flex-col px-2 py-6">
          <div class="flex justify-center py-4">
            <UploadFile
              v-model="avatar"
              :max-count="1"
              class="h-[100px]"
              help-text="上传图片"
            />
          </div>
          <div class="px-2">
            <a-descriptions :column="1" size="small">
              <a-descriptions-item :label="$t('users.userName')">
                {{ userInfo?.userName }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('users.nickName')">
                {{ userInfo?.nickName }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('users.phone')">
                {{ userInfo?.phone }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('users.email')">
                {{ userInfo?.email }}
              </a-descriptions-item>
              <a-descriptions-item :label="$t('users.dept')">
                {{ userInfo?.dept?.deptName }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </a-card>
      <a-card :body-style="bodyStyle" :bordered class="flex-1">
        <div class="flex flex-col gap-2 p-2">
          <a-segmented v-model:value="segmented" :options="segmentedData" />
        </div>
      </a-card>
    </div>
  </Page>
</template>

<style scoped></style>
