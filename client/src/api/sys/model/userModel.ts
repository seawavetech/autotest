/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  identifier: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  jwt: string;
  user: {
    email:  string;
    id:   number;
    username: string;
  }
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  id: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  email: string;
  // 介绍
  desc?: string;
}
