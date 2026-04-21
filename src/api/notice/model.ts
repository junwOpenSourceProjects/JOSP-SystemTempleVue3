/**
 * Notice / Announcement data model
 */

export interface Notice {
  id: number;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "danger";
  author: string;
  publishTime: string;
  status: "published" | "draft" | "archived";
  viewCount: number;
}

export interface NoticeQuery {
  title?: string;
  type?: string;
  status?: string;
  pageNum?: number;
  pageSize?: number;
}

export interface NoticeForm {
  id?: number;
  title: string;
  content: string;
  type: "info" | "warning" | "success" | "danger";
  status: "published" | "draft" | "archived";
}
