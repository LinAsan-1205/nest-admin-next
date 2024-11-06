<script setup>
import { SvgGieeIcon, SvgGithubIcon } from '@vben/icons';
</script>

<template>
  <div class="space-y-4">
    <div
      class="flex items-center justify-between rounded-lg px-4 transition-colors duration-200"
    >
      <div class="flex items-center space-x-4">
        <div class="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
          <SvgGieeIcon class="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="text-gray-900 dark:text-white">绑定 Gitee</h3>
            <span
              class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-400"
              >已绑定</span
            >
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            可通过 Gitee 进行登录
          </p>
        </div>
      </div>
      <a-button> 解绑</a-button>
    </div>

    <div
      class="flex items-center justify-between rounded-lg px-4 transition-colors duration-200"
    >
      <div class="flex items-center space-x-4">
        <div class="rounded-lg bg-gray-100 p-3 dark:bg-gray-700">
          <SvgGithubIcon class="h-5 w-5 text-gray-600 dark:text-gray-300" />
        </div>
        <div>
          <div class="flex items-center space-x-2">
            <h3 class="text-gray-900 dark:text-white">绑定 GitHub</h3>
            <span
              class="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700 dark:bg-green-900 dark:text-green-400"
              >已绑定</span
            >
          </div>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            绑定后，可通过 GitHub 进行登录
          </p>
        </div>
      </div>
      <a-button> 解绑</a-button>
    </div>
  </div>
</template>

<style></style>
