export declare namespace RequestLogApi {
  export interface ListParams {
    url?: string;
    method?: string;
  }
  export interface Item {
    method: string;
    params: string;
    url: string;
    userId: string;
    ip: string;
    createTime: string;
  }
  export type List = Item[];
}
