import type { VxeGlobalRenderer } from 'vxe-table';

import type { TabActionProps } from '#/components/Table/TableAction';

import { h } from 'vue';

import { TabAction } from '#/components/Table/TableAction';

export const actionRenderer = (renderer: VxeGlobalRenderer) => {
  renderer.add('TableAction', {
    renderDefault({ props }: { props: TabActionProps }, params) {
      const { row } = params;
      return h(TabAction, {
        ...props,
        row,
        type: 'table',
      });
    },
  });
};
