export declare namespace CategoryApi {
  export interface ListParams {
    name?: string;
    status?: string;
  }

  export interface Item {
    categoryId: string;
    name: string;
    status: string;
  }

  export type List = Item[];

  export type CreateParams = Item;

  export type ChangeStatus = Pick<Item, 'categoryId' | 'status'>;
}
