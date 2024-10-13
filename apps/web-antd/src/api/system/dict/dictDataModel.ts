export declare namespace DictDataApi {
  export interface ListParams {
    deptType: string;
  }

  export interface SearchFieldDto {
    dictType: string;
  }

  export interface ChangeStatusParams {
    dictCode: string;
    status: string;
  }

  export interface Item {
    dictCode: string;
    dictLabel: string;
    dictValue: string;
    dictType: string;
    status: string;
    remark?: string;
  }

  export type FormModelParams = Pick<Item, 'dictCode'>;

  export type List = Item[];
}
