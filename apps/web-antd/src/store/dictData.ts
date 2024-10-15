import { ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { defineStore } from 'pinia';

import {
  type DictDataApi,
  getAllFields,
  getDictDataFieldList,
} from '#/api/system/dict';

export const useDictDataStore = defineStore('dictData', () => {
  const data = ref<DictDataApi.List>([]);
  const allFields = ref<DictDataApi.AllFields>({});
  const userStore = useUserStore();

  async function fetchData(dictType: string) {
    data.value = await getDictDataFieldList({ dictType });
  }

  function setup() {
    if (!userStore.userInfo) {
      return;
    }
    getAllFields().then((res) => {
      allFields.value = res;
    });
  }

  function $reset() {
    data.value = [];
  }

  return {
    data,
    fetchData,
    $reset,
    setup,
    allFields,
  };
});
