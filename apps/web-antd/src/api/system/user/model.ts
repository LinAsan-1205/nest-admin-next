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
    password?: string;
  }

  export type List = Item[];

  export type CreateParams = Pick<
    Item,
    | 'avatar'
    | 'deptId'
    | 'email'
    | 'nickName'
    | 'password'
    | 'phone'
    | 'remark'
    | 'sex'
    | 'status'
    | 'userName'
  >;

  export type UpdateParams = Partial<CreateParams>;
}
