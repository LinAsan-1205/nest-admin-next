export declare namespace ConfigGroupModelApi {
  export interface Item {
    groupId: string;
    groupName: string;
    code: string;
    remark: null | string;
  }

  export type List = Item[];

  export type CreateParams = Omit<Item, 'groupId'>;

  export type UpdateParams = Item;

  export interface ChangeStatus {
    groupId: string;
    status: string;
  }
}
