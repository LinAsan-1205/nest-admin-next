export declare namespace DictTypeApi {
  export interface ListParams {
    searchValue?: string;
  }

  export interface Item {
    dictId: string;
    dictName: string;
    dictType: string;
    status: string;
    remark?: string;
  }

  export type FormModelParams = Pick<Item, 'dictId'>;

  export type List = Item[];
}
