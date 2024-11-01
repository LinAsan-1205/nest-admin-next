import type { UploadFile } from 'ant-design-vue/es/upload/interface';

export function checkFileType(file: File, accepts: string[]) {
  let reg;
  if (!accepts || accepts.length === 0) {
    reg = /.(?:jpg|jpeg|png|gif|webp)$/i;
  } else {
    const newTypes = accepts.join('|');
    reg = new RegExp(`${String.raw`\.(` + newTypes})$`, 'i');
  }
  return reg.test(file.name);
}
export function getInitialValue(value: UploadFile[]) {
  if (!value || !Array.isArray(value) || value.length === 0) {
    return '';
  }
  if (value.length === 1 && value[0]) {
    return value[0].url as string;
  }
  return value.map((item) => item.url as string).join(',');
}
