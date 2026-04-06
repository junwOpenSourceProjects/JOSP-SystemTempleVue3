import request from "@/utils/request";

export interface TableListItem {
  id: number;
  title: string;
  author: string;
  pageviews: number;
  status: string;
  timestamp: string;
}

export interface TableQuery {
  page: number;
  limit: number;
  title?: string;
  status?: string;
}

export interface TableForm {
  title: string;
  author: string;
  status: string;
}

export class DemoAPI {
  /**
   * 获取表格列表
   */
  static getTableList(params: TableQuery) {
    return request<any, { records: TableListItem[]; total: number }>({
      url: "/api/v1/demo/table/list",
      method: "get",
      params,
    });
  }

  /**
   * 获取表格记录
   */
  static getTableItem(id: number) {
    return request<any, TableListItem>({
      url: `/api/v1/demo/table/${id}`,
      method: "get",
    });
  }

  /**
   * 新增表格记录
   */
  static createTableItem(data: TableForm) {
    return request({
      url: "/api/v1/demo/table",
      method: "post",
      data,
    });
  }

  /**
   * 更新表格记录
   */
  static updateTableItem(id: number, data: TableForm) {
    return request({
      url: `/api/v1/demo/table/${id}`,
      method: "put",
      data,
    });
  }

  /**
   * 删除表格记录
   */
  static deleteTableItem(id: number) {
    return request({
      url: `/api/v1/demo/table/${id}`,
      method: "delete",
    });
  }
}
