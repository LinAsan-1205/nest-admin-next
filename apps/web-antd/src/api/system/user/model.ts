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
}
