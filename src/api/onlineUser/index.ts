import request from "@/utils/request";

export interface OnlineUser {
  userId: number
  username: string
  nickname: string
  ip: string
  address: string
  browser: string
  os: string
  token: string
  loginTime: string
  expireTime: string
}

export interface OnlineUserPageQuery {
  pageNum: number
  pageSize: number
  username?: string
}

export interface PageResult<T = any> {
  list: T[]
  total: number
  pageNum: number
  pageSize: number
}

// 获取在线用户分页列表
export const getOnlineUserPage = (params: OnlineUserPageQuery) => {
  return request.get<any, any>('/api/v1/online-users/page', { params })
}

// 获取在线用户数量
export const getOnlineUserCount = () => {
  return request.get<any, any>('/api/v1/online-users/count')
}

// 强制下线
export const forceLogout = (token: string) => {
  return request.delete<any, any>(`/api/v1/online-users/${token}`)
}

// 全部下线
export const logoutAll = () => {
  return request.delete<any, any>('/api/v1/online-users/logout-all')
}
