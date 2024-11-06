export declare namespace UserApi {
  export interface Profile {
    userId: number;
    userName: string;
    nickName: string;
    userType: string;
    email: string;
    phone: string;
    sex: string;
    avatar: string;
    homePath?: string;
    roles: string[];
  }

  export interface ChangeStatus {
    id: string;
    status: string;
  }

  export type ListParams = object;

  export interface Item {
    avatar?: string;
    createTime: string;
    deptId: string;
    email: string;
    loginDate: string;
    loginIp: string;
    nickName: string;
    phone: string;
    remark: any;
    sex: string;
    status: string;
    userId: string;
    userName: string;
    userType: string;
    userTypeDisable: boolean;
    userTypeName: string;
    password: string;
    signed: string;
  }

  export type List = Item[];

  export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  export type CreateParams = Optional<
    Item,
    | 'avatar'
    | 'email'
    | 'loginDate'
    | 'loginIp'
    | 'nickName'
    | 'phone'
    | 'remark'
    | 'signed'
    | 'userId'
  >;

  export type UpdateParams = Optional<
    Item,
    | 'avatar'
    | 'email'
    | 'loginDate'
    | 'loginIp'
    | 'nickName'
    | 'phone'
    | 'remark'
    | 'signed'
  >;

  export type BasicInformationParams = Partial<
    Pick<Item, 'nickName' | 'sex' | 'signed' | 'userId'>
  >;
}
