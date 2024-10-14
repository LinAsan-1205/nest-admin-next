import type { VxeGlobalRenderer } from 'vxe-table';

import type { DictTagProps } from '#/components/Table/CellRender';

import { h } from 'vue';

import { DictTag } from '#/components/Table/CellRender';

export const dictRenderer = (renderer: VxeGlobalRenderer) => {
  renderer.add('DictTag', {
    renderDefault({ props }: { props: DictTagProps }, params) {
      const { column, row } = params;
      return h(DictTag, { ...props, value: row[column.field] });
    },
  });
};
