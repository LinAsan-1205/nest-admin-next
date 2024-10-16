import type { VxeGlobalFormats } from 'vxe-table';

export const createFormats = (formats: VxeGlobalFormats) => {
  formats.add('formatEmpty', {
    tableCellFormatMethod({ cellValue }) {
      if (cellValue === '-' || cellValue === null || !cellValue) return '-';
      return cellValue;
    },
  });

  formats.add('formatSize', {
    tableCellFormatMethod({ cellValue }) {
      const fileSize = cellValue / (1024 * 1024);
      if (fileSize < fileSize * 1024) {
        return `${fileSize.toFixed(2)}MB`;
      }
      return `${(fileSize / 1024).toFixed(2)}GB`;
    },
  });
};
