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
