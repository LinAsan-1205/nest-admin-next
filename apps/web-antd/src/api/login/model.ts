export namespace AuthApi {
  /** 账号登录接口参数 */
  export interface AccountLoginParams {
    password: string;
    userName: string;
    captchaId: string;
    verifyCode: string;
  }

  export interface CaptchaResult {
    /** 验证码ID */
    captchaId: string;
    /** 验证码图片 */
    img: string;
  }

  /** 账号登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    desc: string;
    realName: string;
    userId: string;
    username: string;
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}
