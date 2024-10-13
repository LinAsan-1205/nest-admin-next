export declare namespace MenuApi {
  export interface ListParams {
    menuName?: string;
    status?: string;
  }
  export interface Item {
    menuId: string;
    status: string;
  }
  export type List = Item[];
}
