export declare namespace LoginLogApi {
  export interface ListParams {
    userName?: string;
    ip?: string;
  }

  export interface Item {
    loginId: string;
    userName: string;
    ip: string;
    country: string;
    province: string;
    city: string;
    district: string;
    isp: string;
    browser: string;
    os: string;
    msg: string;
    status: string;
    loginTime: string;
  }
}
