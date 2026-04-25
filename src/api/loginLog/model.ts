/**
 * 登录日志查询对象类型
 */
export interface LoginLogQuery extends PageQuery {
  username?: string;
  status?: string;
}

/**
 * 登录日志分页对象
 */
export interface LoginLogPageVO {
  /**
   * 登录IP地址
   */
  ip?: string;
  /**
   * 登录地点
   */
  address?: string;
  /**
   * 浏览器
   */
  browser?: string;
  /**
   * 提示消息
   */
  msg?: string;
  /**
   * 登录时间
   */
  loginTime?: Date;
  /**
   * 登录状态(0成功 1失败)
   */
  status?: string;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 编号
   */
  id?: number;
}
