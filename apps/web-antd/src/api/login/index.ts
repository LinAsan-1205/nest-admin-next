import { requestClient } from '#/api/core/request';

import { type AuthApi } from './model';

/**
 * 账号登录接口
 * @param data
 */
export async function accountLogin(data: AuthApi.AccountLoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/account/login', data);
}

/**
 * 获取验证码
 */
export async function getCaptcha() {
  return requestClient.post<AuthApi.CaptchaResult>('/auth/captcha');
}

/**
 * 退出登录
 */
export function logout() {
  return requestClient.post('/auth/logout');
}
