export declare namespace RoleApi {
  export interface ListParams {
    roleName?: string;
    status?: string;
  }

  export interface Item {
    roleId: string;
    roleName: string;
    roleSort: number;
  }

  export type List = Item[];

  export type CreateParams = Item;

  export interface ChangeStatus {
    roleId: string;
    status: string;
  }
}
