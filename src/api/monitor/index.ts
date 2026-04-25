import request from "@/utils/request";

export interface ServerInfo {
  cpu: {
    count: number
    used: number
    sys: number
    user: number
  }
  memory: {
    total: number
    used: number
    free: number
    usage: number
  }
  jvm: {
    total: number
    used: number
    free: number
    max: number
    version: string
    name: string
  }
  os: {
    name: string
    arch: string
    version: string
  }
  sys: {
    computerName: string
    computerIp: string
    osName: string
    osArch: string
  }
  disk: {
    total: number
    used: number
    free: number
    usage: number
  }
}

export interface DatabaseInfo {
  name: string
  type: string
  version: string
  size: number
  tables: number
}

export interface RedisInfo {
  version: string
  mode: string
  connectedClients: number
  usedMemory: number
  usedMemoryHuman: string
  uptime: number
  uptimeInDays: number
}

export interface MonitorVO {
  server: ServerInfo
  database: DatabaseInfo
  redis: RedisInfo
  timestamp: number
}

// 获取全部监控信息
export const getMonitorInfo = () => {
  return request.get<any, any>('/api/v1/monitor/info')
}

// 获取服务器信息
export const getServerInfo = () => {
  return request.get<any, any>('/api/v1/monitor/server')
}

// 获取数据库信息
export const getDatabaseInfo = () => {
  return request.get<any, any>('/api/v1/monitor/database')
}

// 获取Redis信息
export const getRedisInfo = () => {
  return request.get<any, any>('/api/v1/monitor/redis')
}
