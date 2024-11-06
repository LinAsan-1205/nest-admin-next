<script setup>
import { useUserStore } from '@vben/stores';

import { LockIcon, MailIcon, PhoneIcon } from 'lucide-vue-next';

const { userInfo } = useUserStore();
</script>

<template>
  <div class="space-y-4">
    <div
      class="flex items-center justify-between rounded-lg px-4 transition-colors duration-200"
    >
      <div class="flex items-center space-x-4">
        <div class="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
          <PhoneIcon class="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="text-gray-900 dark:text-white">安全手机</h3>
            <span
              class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-400"
              >已绑定</span
            >
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ userInfo?.phone }} 可用于登录、身份验证、密码找回、通知提醒
          </p>
        </div>
      </div>
      <a-button> 修改</a-button>
    </div>

    <div
      class="flex items-center justify-between rounded-lg px-4 transition-colors duration-200"
    >
      <div class="flex items-center space-x-4">
        <div class="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
          <MailIcon class="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="text-gray-900 dark:text-white">安全邮箱</h3>
            <span
              class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-400"
              >已绑定</span
            >
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            <template v-if="userInfo?.email">
              {{ userInfo?.email }} 可用于登录、身份验证、密码找回、通知提醒
            </template>
            <template v-else>该账号未设置邮箱</template>
          </p>
        </div>
      </div>
      <a-button> 修改</a-button>
    </div>

    <div
      class="flex items-center justify-between rounded-lg px-4 transition-colors duration-200"
    >
      <div class="flex items-center space-x-4">
        <div class="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
          <LockIcon class="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="text-gray-900 dark:text-white">登录密码</h3>
            <span
              class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-400"
              >已设置</span
            >
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            为了您的账号安全，建议定期更换密码
          </p>
        </div>
      </div>
      <a-button> 修改</a-button>
    </div>
  </div>
</template>

<style></style>
