export declare namespace DeptApi {
  export interface ListParams {
    deptName?: string;
  }
  export interface List {
    deptId: string;
    parentId: string;
    deptName: string;
    orderNum: number;
    leader: string;
    phone: null | string;
    email: null | string;
    status: string;
  }
}
