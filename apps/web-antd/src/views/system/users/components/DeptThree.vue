<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { type DeptApi, getDeptList } from '#/api/system/dept';

const modelValue = defineModel<null | string>();

const searchValue = ref<string>('');

const deptList = ref<DeptApi.List>([]);

const flattenDeptList = (list: DeptApi.List) => {
  const flattened: DeptApi.List = [];
  const stack = [...list];
  while (stack.length > 0) {
    const item = stack.pop();
    if (item) {
      flattened.push(item);
      if (item.children && item.children.length > 0) {
        stack.push(...item.children);
        item.children = [];
      }
    }
  }
  return flattened.reverse();
};

const fetch = async () => {
  deptList.value = await getDeptList({ status: '0' });
};

const onTreeSelect = (selectedKeys: string[]) => {
  modelValue.value = selectedKeys[0] || null;
};

watch(searchValue, async (value: string) => {
  if (value) {
    const data = flattenDeptList(deptList.value);
    deptList.value = data.filter((item) => item.deptName.includes(value));
  } else {
    await fetch();
  }
});

onMounted(async () => {
  await fetch();
});
</script>

<template>
  <a-card :bordered="false" class="mb-4 flex-none md:mb-0 md:w-[250px]">
    <a-input-search
      v-model:value="searchValue"
      class="mb-2"
      placeholder="请输入名称/描述"
    />
    <a-tree
      v-if="deptList.length > 0"
      :field-names="{
        title: 'deptName',
        key: 'deptId',
        children: 'children',
      }"
      :tree-data="deptList"
      block-node
      default-expand-all
      @select="onTreeSelect"
    />
  </a-card>
</template>

<style scoped></style>
