import type { VxeUIExport } from 'vxe-table';

import dayjs from 'dayjs';

export function initDefaultFormatter(vxeUI: VxeUIExport) {
  vxeUI.formats.add('formatDate', {
    tableCellFormatMethod({ cellValue }) {
      return dayjs(cellValue).format('YYYY-MM-DD');
    },
  });

  vxeUI.formats.add('formatDateTime', {
    tableCellFormatMethod({ cellValue }) {
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss');
    },
  });

  vxeUI.formats.add('formatEmpty', {
    tableCellFormatMethod({ cellValue }) {
      if (cellValue === null || cellValue === '' || !cellValue) return '-';
      return cellValue;
    },
  });
}
