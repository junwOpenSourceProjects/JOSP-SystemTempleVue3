import request from "@/utils/request";

const CONFIG_BASE_URL = "/api/v1/config";

export interface ConfigQuery {
  page?: number;
  limit?: number;
  configName?: string;
  configKey?: string;
}

export interface ConfigForm {
  id?: number;
  name: string;
  configKey: string;
  value: string;
  type?: string;
  status?: number;
  remark?: string;
}

class ConfigAPI {
  /**
   * 分页查询系统配置
   */
  static getPage(queryParams: ConfigQuery) {
    return request<any, any>({
      url: `${CONFIG_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  }

  /**
   * 获取所有配置列表
   */
  static getList() {
    return request<any, any>({
      url: `${CONFIG_BASE_URL}/list`,
      method: "get",
    });
  }

  /**
   * 获取配置详情
   */
  static getById(id: number) {
    return request<any, any>({
      url: `${CONFIG_BASE_URL}/${id}`,
      method: "get",
    });
  }

  /**
   * 根据配置键获取配置值
   */
  static getByKey(configKey: string) {
    return request<any, any>({
      url: `${CONFIG_BASE_URL}/key/${configKey}`,
      method: "get",
    });
  }

  /**
   * 创建系统配置
   */
  static add(data: ConfigForm) {
    return request<any, any>({
      url: `${CONFIG_BASE_URL}`,
      method: "post",
      data,
    });
  }

  /**
   * 更新系统配置
   */
  static update(id: number, data: ConfigForm) {
    return request<any, any>({
      url: `${CONFIG_BASE_URL}/${id}`,
      method: "put",
      data,
    });
  }

  /**
   * 删除系统配置
   */
  static deleteByIds(ids: string) {
    return request<any, any>({
      url: `${CONFIG_BASE_URL}/${ids}`,
      method: "delete",
    });
  }

  /**
   * 批量删除系统配置
   */
  static deleteBatch(ids: string[]) {
    return request<any, any>({
      url: `${CONFIG_BASE_URL}/batch`,
      method: "delete",
      data: ids,
    });
  }

  /**
   * 刷新配置缓存
   */
  static refreshCache() {
    return request<any, any>({
      url: `${CONFIG_BASE_URL}/refresh`,
      method: "post",
    });
  }

  /**
   * 获取所有配置（Map形式）
   */
  static getAllConfigMap() {
    return request<any, any>({
      url: `${CONFIG_BASE_URL}/all`,
      method: "get",
    });
  }
}

export default ConfigAPI;
