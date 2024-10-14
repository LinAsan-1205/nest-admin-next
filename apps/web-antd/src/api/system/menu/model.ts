export declare namespace MenuApi {
  export interface ListParams {
    menuName?: string;
    status?: string;
  }
  export interface Item {
    menuId: string;
    menuName?: string;
    path: string;
    redirect: string;
    order: number;
    perms: string;
    menuType: 'C' | 'F' | 'M';
    name: string;
    status: string;
    component: string;
    keepAlive: boolean;
    hideInMenu: boolean;
    hideInBreadcrumb: boolean;
    hideInTab: boolean;
    hideChildrenInMenu: boolean;
    badgeVariants: string;
    badge: string;
    badgeType: string;
    parentId: string;
    remark?: string;
  }
  export type List = Item[];

  export type FormModelParams = Item;

  export interface ChangeStatusParams {
    id: string;
    status: string;
  }
}
