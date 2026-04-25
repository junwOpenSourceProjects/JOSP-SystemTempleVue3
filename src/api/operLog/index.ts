import request from "@/utils/request";

export interface OperLog {
  id: number
  title: string
  operName: string
  operType: string
  method: string
  requestMethod: string
  operUrl: string
  operParam: string
  jsonResult: string
  status: '0' | '1'
  operTime: string
  costTime: number
  ip: string
  address: string
}

export interface OperLogPageQuery {
  pageNum: number
  pageSize: number
  title?: string
  operName?: string
  status?: string
}

export interface PageResult<T = any> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

// 获取操作日志分页列表
export const getOperLogPage = (params: OperLogPageQuery) => {
  return request.get<any, any>('/api/v1/oper-logs/page', { params })
}

// 删除操作日志
export const deleteOperLog = (id: number) => {
  return request.delete<any, any>(`/api/v1/oper-logs/${id}`)
}

// 批量删除操作日志
export const batchDeleteOperLog = (ids: number[]) => {
  return request.delete<any, any>('/api/v1/oper-logs/batch', { data: ids })
}

// 清理操作日志
export const cleanOperLog = (days: number) => {
  return request.delete<any, any>('/api/v1/oper-logs/clean', { params: { days } })
}
