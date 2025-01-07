export declare namespace LinkApi {
  export interface ListParams {
    tagsName?: string;
    status?: string;
  }

  export interface View {
    linksId: string;
    linksName: string;
    url: string;
    icon?: string;
    type: string;
    status: string;
    desc?: string;
  }

  export type List = View[];

  export type FormParams = View;
}
