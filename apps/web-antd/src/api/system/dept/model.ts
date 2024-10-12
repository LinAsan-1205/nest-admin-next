export declare namespace DeptApi {
  export interface ListParams {
    deptName?: string;
    status?: string;
  }
  export interface Item {
    deptId: string;
    parentId: string;
    deptName: string;
    orderNum: number;
    leader: string;
    phone: null | string;
    email: null | string;
    status: string;
    children: Item[];
  }
  export type List = Item[];

  export type CreateParams = Item;

  export interface ChangeStatus {
    deptId: string;
    status: string;
  }
}
