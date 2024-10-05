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

  export type List = {
    avatar: string;
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
  };
}
