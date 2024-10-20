import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  /**
   * 用户描述
   */
  desc: string;
  /**
   * 首页地址
   */
  homePath: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色信息
   */
  roles: string[];
  /**
   * 头像
   */
  avatar: string;

  nickName: string;
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;

  /**
   * accessToken
   */
  token: string;
}

export type { UserInfo };
