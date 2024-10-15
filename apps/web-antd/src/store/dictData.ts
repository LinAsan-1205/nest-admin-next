import { ref } from 'vue';

import { defineStore } from 'pinia';

import {
  type DictDataApi,
  getAllFields,
  getDictDataFieldList,
} from '#/api/system/dict';

export const useDictDataStore = defineStore('dictData', () => {
  const data = ref<DictDataApi.List>([]);
  const allFields = ref<DictDataApi.AllFields>({});

  async function fetchData(dictType: string) {
    data.value = await getDictDataFieldList({ dictType });
  }

  function setup() {
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
