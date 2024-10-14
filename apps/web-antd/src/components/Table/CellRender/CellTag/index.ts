import { type TagProps } from 'ant-design-vue/es/tag';

export interface CellTagProps {
  checkedValue: boolean | number | string;
  unCheckedValue: boolean | number | string;
  checkedText?: string;
  unCheckedText?: string;
  checkedColor?: TagProps['color'];
  unCheckedColor?: TagProps['color'];
}

export { default as CellTag } from './CellTag.vue';
