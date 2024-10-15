<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useRefresh } from '@vben/hooks';
import { PlusOutlined, RefreshOutlined } from '@vben/icons';

import { message, Modal } from 'ant-design-vue';

import { getClassifyList } from '#/api/system/attachment';
import { deleteDictType, type DictTypeApi } from '#/api/system/dict';
import { $t } from '#/locales';
import { waitingDelayResolve } from '#/utils';

import ClassifyFormModel from './ClassifyFormModel.vue';

const modelValue = defineModel<null | string>();

const { refresh } = useRefresh();

const searchValue = ref<string>('');

const dictTypeList = ref<DictTypeApi.List>([]);

const spinning = ref(true);

const activeStyle = computed(() => {
  return {
    color: 'rgba(50, 54, 57, 0.88)',
    backgroundColor: 'rgba(50, 54, 57, 0.06)',
  };
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: ClassifyFormModel,
});

const fetch = async () => {
  spinning.value = true;
  await waitingDelayResolve(500);
  dictTypeList.value = await getClassifyList({
    searchValue: searchValue.value,
  }).finally(() => {
    spinning.value = false;
  });
};

const onCreate = () => {
  formModalApi.setState({ title: $t('page.dictType.createType') });
  formModalApi.setData({
    update: false,
  });
  formModalApi.open();
};

const onUpdate = (row: DictTypeApi.Item) => {
  formModalApi.setState({ title: $t('page.dictType.updateType') });
  formModalApi.setData({
    values: {
      ...row,
    },
    update: true,
    dictTypeId: row.dictId,
  });
  formModalApi.open();
};

const onRemove = (ids: string) => {
  Modal.confirm({
    title: $t('page.modal.confirmTitle'),
    content: $t('page.modal.confirmContent'),
    onOk: async () => {
      await deleteDictType(ids);
      message.success($t('page.apiRemove'));
      await fetch();
    },
  });
};

watch(searchValue, async () => {
  await fetch();
});

onMounted(async () => {
  await fetch();
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
          <h3 class="flex-1">{{ $t('page.attachment.classify') }}</h3>
          <a-tooltip :title="$t('page.icon.refresh')">
            <a-button size="small" type="text" @click="refresh">
              <RefreshOutlined />
            </a-button>
          </a-tooltip>
          <a-tooltip :title="$t('page.modal.add')">
            <a-button size="small" type="text" @click="onCreate">
              <PlusOutlined />
            </a-button>
          </a-tooltip>
        </div>
        <a-input-search
          v-model:value="searchValue"
          placeholder="请输入名称/描述"
        />
        <a-spin :spinning="spinning" tip="Loading...">
          <div
            :class="spinning ? 'pt-20' : ''"
            class="flex flex-col space-y-1 pt-2"
          >
            <div v-for="item in dictTypeList" :key="item.dictId" class="w-full">
              <a-dropdown :trigger="['contextmenu']">
                <a-button
                  :style="item.classifyId === modelValue ? activeStyle : {}"
                  class="m-0 flex w-full px-1"
                  type="text"
                  @click="modelValue = item.classifyId"
                >
                  {{ item.classifyName }}
                </a-button>
                <template #overlay>
                  <a-menu>
                    <a-menu-item key="1" @click="onUpdate(item)">
                      编辑
                    </a-menu-item>
                    <a-menu-item key="2" @click="onRemove(item.dictId)">
                      删除
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div>
          </div>
        </a-spin>
      </div>
      <a-button type="primary" @click="onCreate">
        {{ $t('page.modal.add') }}
      </a-button>
    </div>
    <FormModal @refresh="fetch" />
  </a-card>
</template>

<style scoped></style>
