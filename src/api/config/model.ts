/**
 * 系统配置数据模型
 */

export interface Config {
  id: number;
  name: string;
  configKey: string;
  value: string;
  type: string;
  status: number;
  remark?: string;
  createTime?: string;
  updateTime?: string;
  createUser?: number;
  updateUser?: number;
}
