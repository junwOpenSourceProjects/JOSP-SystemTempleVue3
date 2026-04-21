import request from "@/utils/request";
import type { Notice, NoticeQuery, NoticeForm } from "./model";

const NOTICE_BASE_URL = "/api/v1/notices";

class NoticeAPI {
  /**
   * 获取通知公告分页列表
   */
  static getPage(queryParams: NoticeQuery) {
    return request<any, PageResult<Notice[]>>({
      url: `${NOTICE_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  }

  /**
   * 获取通知公告表单详情
   */
  static getFormData(id: number) {
    return request<any, NoticeForm>({
      url: `${NOTICE_BASE_URL}/${id}/form`,
      method: "get",
    });
  }

  /**
   * 获取单条通知公告
   */
  static getById(id: number) {
    return request<any, Notice>({
      url: `${NOTICE_BASE_URL}/${id}`,
      method: "get",
    });
  }

  /**
   * 添加通知公告
   */
  static add(data: NoticeForm) {
    return request({
      url: `${NOTICE_BASE_URL}`,
      method: "post",
      data: data,
    });
  }

  /**
   * 修改通知公告
   */
  static update(id: number, data: NoticeForm) {
    return request({
      url: `${NOTICE_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  }

  /**
   * 删除通知公告
   */
  static deleteByIds(ids: string) {
    return request({
      url: `${NOTICE_BASE_URL}/${ids}`,
      method: "delete",
    });
  }
}

export default NoticeAPI;
