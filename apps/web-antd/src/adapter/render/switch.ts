import type { SwitchProps } from 'ant-design-vue/es/switch';
import type { VxeGlobalRenderer } from 'vxe-table';

import { h } from 'vue';

import { Switch } from 'ant-design-vue';

export const switchRenderer = (renderer: VxeGlobalRenderer) => {
  renderer.add('switch', {
    renderDefault(
      {
        props,
      }: {
        props: {
          disabledValue?: <R = any>(row: R) => boolean;
          onChangeStatus: (
            checked: boolean | number | string,
            row: any,
          ) => void;
        } & SwitchProps;
      },
      params,
    ) {
      const { column, row } = params;

      return h(Switch, {
        ...props,
        row,
        checked: row[column.field],
        disabled:
          typeof props.disabledValue === 'function'
            ? props.disabledValue(row)
            : false,
        onChange: (checked: boolean | number | string) => {
          props.onChangeStatus && props.onChangeStatus(checked, row);
        },
      });
    },
  });
};
