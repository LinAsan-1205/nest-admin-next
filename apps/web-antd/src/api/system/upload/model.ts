export declare namespace UploadApi {
  export interface ListParams {
    deptName?: string;
  }
  export interface Item {
    attachmentId: string;
    objectName: string;
    originName: string;
    sizeByte: number;
    sizeInfo: string;
    suffix: string;
    mimeType: string;
    url: string;
    storagePath: string;
  }
  export type List = Array<Item>;
}
