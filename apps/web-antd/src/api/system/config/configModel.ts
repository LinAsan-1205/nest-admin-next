export declare namespace ConfigModelApi {
  export interface Item {
    groupId: string;
    key: string;
    name: string;
    value: string;
    sort: number;
    configData: Record<any, any>;
    inputType: string;
    remark: null | string;
  }
  export type List = Item[];

  export type CreateParams = Omit<Item, 'groupId'>;

  export type UpdateAllFields = Record<string, boolean | number | string>;

  export interface ChangeStatus {
    groupId: string;
    status: string;
  }
}
