export declare namespace ConfigGroupModelApi {
  export interface Item {
    groupId: string;
    groupName: string;
    code: string;
    status: string;
    remark: null | string;
  }
  export type List = Item[];

  export type CreateParams = Item;

  export interface ChangeStatus {
    groupId: string;
    status: string;
  }
}
