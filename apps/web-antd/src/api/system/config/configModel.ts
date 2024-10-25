export declare namespace ConfigModelApi {
  export interface Item {
    groupId: string;
    key: string;
    name: string;
    value: string;
    sort: number;
    inputType: string;
    remark: null | string;
  }
  export type List = Item[];

  export type CreateParams = Item;

  export interface ChangeStatus {
    groupId: string;
    status: string;
  }
}
