export declare namespace TagApi {
  export interface ListParams {
    tagsName?: string;
    status?: string;
  }

  export interface View {
    tagsId: string;
    tagsName: string;
    status: string;
    desc?: string;
  }

  export type List = View[];

  export type FormParams = View;
}
