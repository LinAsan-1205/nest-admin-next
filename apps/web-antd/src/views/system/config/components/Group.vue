<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Empty, message } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import {
  type ConfigGroupModelApi,
  type ConfigModelApi,
  getConfigGroupList,
  getConfigurationBasedOnGrouping,
  updateConfigAllFields,
} from '#/api/system/config';
import { $t } from '#/locales';

import GroupFormModel from './GroupFormModel.vue';

const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;

const modelValue = defineModel<string>();
const data = ref<ConfigGroupModelApi.List>([]);

const configData = ref<ConfigModelApi.List>([]);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  wrapperClass: 'grid-cols-1',
  handleSubmit: onSubmit,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: GroupFormModel,
});

const segmentedOptions = computed(() =>
  data.value.flatMap((item) => ({
    label: item.groupName,
    value: item.groupId,
  })),
);

const showEmpty = computed(() => configData.value.length === 0);

const fetch = async () => {
  const res = await getConfigGroupList();
  data.value = res;
  if (!modelValue.value) {
    modelValue.value = res[0]?.groupId;
  }
};

const getDefaultValue = (inputType: string, value: string) => {
  if (!value) {
    return null;
  }
  if (inputType === 'datePicker') {
    return dayjs(value);
  }
  return value || '';
};

const fetchConfig = async () => {
  const res = await getConfigurationBasedOnGrouping(modelValue.value);
  configData.value = res;
  formApi.setState({ showDefaultActions: res.length > 0 });
  formApi.setState((_) => {
    return {
      schema: res.flatMap((item) => {
        const defaultValue = getDefaultValue(item.inputType, item.value);
        const configData = item.configData ?? {};
        const componentProps = Object.assign(
          {},
          {
            placeholder: '请输入',
            defaultValue,
          },
          configData,
        );
        return {
          component: item.inputType.replace(/^./, (char) => char.toUpperCase()),
          componentProps,
          help: item.key,
          fieldName: item.key,
          label: item.name,
          value: defaultValue,
        };
      }),
    };
  });
};

const onCreate = () => {
  formModalApi.setState({ title: $t('config.group.create') });
  formModalApi.setData({
    update: false,
  });
  formModalApi.open();
};

const onUpdate = () => {
  const row = data.value.find((item) => item.groupId === modelValue.value);
  if (!row) return;
  formModalApi.setState({ title: $t('config.group.update') });
  formModalApi.setData({
    values: {
      ...row,
    },
    update: true,
    groupId: row.groupId,
  });
  formModalApi.open();
};

async function onSubmit(values: ConfigModelApi.UpdateAllFields) {
  if (!modelValue.value) {
    return;
  }
  await updateConfigAllFields(modelValue.value, values);
  message.success($t('api.editSuccess'));
}

onMounted(() => {
  fetch();
});

watch(modelValue, () => {
  fetchConfig();
});

defineExpose({
  fetch,
  fetchConfig,
});
</script>

<template>
  <a-card
    :body-style="{ padding: '10px', width: '100%' }"
    :bordered="false"
    class="mb-4 h-full flex-1 md:mb-0"
  >
    <div class="mb-4 flex w-full justify-end gap-x-4">
      <a-button type="primary" @click="onCreate">
        {{ $t('config.group.create') }}
      </a-button>
      <a-button type="primary" @click="onUpdate">
        {{ $t('config.group.update') }}
      </a-button>
      <a-button type="primary">{{ $t('config.group.disposition') }}</a-button>
    </div>
    <div v-if="segmentedOptions.length > 0" class="flex flex-col">
      <a-segmented
        v-model:value="modelValue"
        :options="segmentedOptions"
        class="mb-4"
      />
      <Form />
      <a-empty v-if="showEmpty" :image="simpleImage" />
    </div>
    <FormModal @refresh="fetch" />
  </a-card>
</template>

<style scoped></style>
