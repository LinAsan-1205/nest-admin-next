export declare namespace ClassifyApi {
  export interface SearchParams {
    searchValue?: string;
  }

  export interface Item {
    classifyId: string;
    classifyName: string;
    parentId?: string;
    remark?: string;
  }

  export interface FormModelParams extends Item {
    classifyId?: string;
  }

  export type List = Item[];
}

export declare namespace AttachmentApi {
  export interface SearchParams {
    objectName?: string;
    classifyId: string;
  }

  export interface Item {
    createTime: string;
    deleteTime: string;
    updateTime: string;
    createBy: string;
    updateBy: string;
    attachmentId: string;
    objectName: string;
    originName: string;
    sizeByte: number;
    suffix: string;
    mimeType: string;
    url: string;
    storagePath: string;
  }

  export type List = Item[];
}
