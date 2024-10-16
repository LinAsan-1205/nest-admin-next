<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useRefresh } from '@vben/hooks';
import { PlusOutlined, RefreshOutlined } from '@vben/icons';
import { $t } from '@vben/locales';

import { message, Modal } from 'ant-design-vue';

import { waitingDelayResolve } from '#/utils';

const {
  title,
  placeholder = '请输入',
  getRequest,
  deleteRequest,
  fieldName,
  fieldKey,
} = defineProps<{
  deleteRequest?: Function;
  fieldKey?: string;
  fieldName?: string;
  getRequest?: Function;
  placeholder?: string;
  title?: string;
}>();

const modelValue = defineModel<number | string>();

const { refresh } = useRefresh();

const list = ref<unknown[]>([]);

const spinning = ref(true);

const searchValue = ref<string>('');

const activeStyle = computed(() => {
  return {
    color: 'rgba(50, 54, 57, 0.88)',
    backgroundColor: 'rgba(50, 54, 57, 0.06)',
  };
});

const fetch = async () => {
  if (typeof getRequest !== 'function') {
    return;
  }
  spinning.value = true;
  await waitingDelayResolve(500);
  list.value = await getRequest(searchValue.value).finally(() => {
    spinning.value = false;
  });
};

const onRemove = (ids: string) => {
  if (typeof deleteRequest !== 'function') {
    return;
  }
  Modal.confirm({
    title: $t('page.modal.confirmTitle'),
    content: $t('page.modal.confirmContent'),
    onOk: async () => {
      await deleteRequest(ids);
      message.success($t('page.apiRemove'));
      await fetch();
    },
  });
};

onMounted(() => {
  fetch();
});
</script>

<template>
  <a-card
    :body-style="{ padding: '10px' }"
    :bordered="false"
    class="mb-4 h-full flex-none md:mb-0 md:flex md:w-[250px]"
  >
    <div class="flex h-full flex-col">
      <div class="flex flex-1 flex-col">
        <div class="mb-2 flex items-center">
          <h3 class="flex-1">{{ title }}</h3>
          <a-tooltip :title="$t('page.icon.refresh')">
            <a-button size="small" type="text" @click="refresh">
              <RefreshOutlined />
            </a-button>
          </a-tooltip>
          <a-tooltip :title="$t('page.modal.add')">
            <a-button size="small" type="text">
              <PlusOutlined />
            </a-button>
          </a-tooltip>
        </div>
        <!--搜索-->
        <a-input-search
          v-model:value="searchValue"
          :placeholder="placeholder"
        />
        <!--加载-->
        <a-spin :spinning="spinning" tip="Loading...">
          <div
            :class="spinning ? 'pt-20' : ''"
            class="flex flex-col space-y-1 pt-2"
          >
            <div v-for="item in list" :key="item[fieldKey]" class="w-full">
              <a-dropdown :trigger="['contextmenu']">
                <a-button
                  :style="item[fieldKey] === modelValue ? activeStyle : {}"
                  class="m-0 flex w-full px-1"
                  type="text"
                  @click="modelValue = item[fieldKey]"
                >
                  {{ item[fieldName] }}
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1" @click="onUpdate(item)">
                      编辑
                    </a-menu-item>
                    <a-menu-item key="2" @click="onRemove(item[fieldKey])">
                      删除
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </a-spin>
      </div>
    </div>
  </a-card>
</template>

<style scoped></style>
