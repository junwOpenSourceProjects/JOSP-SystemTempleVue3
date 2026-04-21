import { defineMock } from "./base";

export default defineMock([
  {
    url: "dashboard/stats",
    method: ["GET"],
    body: {
      code: 200,
      data: {
        total: 10284,
        active: 3821,
        new: 156,
      },
      msg: "一切ok",
    },
  },
  {
    url: "dashboard/visit-trend",
    method: ["GET"],
    body: {
      code: 200,
      data: {
        dates: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        visits: [820, 932, 901, 1234, 1290, 1530, 1350],
        pageViews: [320, 453, 390, 630, 732, 820, 680],
      },
      msg: "一切ok",
    },
  },
  {
    url: "dashboard/dept-distribution",
    method: ["GET"],
    body: {
      code: 200,
      data: {
        names: ["技术部", "产品部", "运营部", "市场部", "财务部"],
        values: [4200, 2800, 1800, 900, 584],
      },
      msg: "一切ok",
    },
  },
  {
    url: "dashboard/system-info",
    method: ["GET"],
    body: {
      code: 200,
      data: {
        version: "2.1.0",
        nodeVersion: "v20.10.0",
        platform: "Linux x64",
        memoryUsage: 42,
        uptime: 168,
      },
      msg: "一切ok",
    },
  },
  {
    url: "dashboard/activity-logs",
    method: ["GET"],
    body: {
      code: 200,
      data: [
        {
          id: 1,
          user: "张明",
          action: "发布了新的项目公告",
          module: "系统通知",
          time: "2分钟前",
          status: "success",
        },
        {
          id: 2,
          user: "李华",
          action: "更新了用户权限配置",
          module: "权限管理",
          time: "15分钟前",
          status: "success",
        },
        {
          id: 3,
          user: "王芳",
          action: "导入了50条新用户数据",
          module: "用户管理",
          time: "32分钟前",
          status: "success",
        },
        {
          id: 4,
          user: "赵强",
          action: "删除了过期的日志文件",
          module: "系统维护",
          time: "1小时前",
          status: "warning",
        },
        {
          id: 5,
          user: "陈静",
          action: "修改了财务报表内容",
          module: "财务管理",
          time: "2小时前",
          status: "success",
        },
        {
          id: 6,
          user: "刘洋",
          action: "批量更新了订单状态",
          module: "订单管理",
          time: "3小时前",
          status: "success",
        },
        {
          id: 7,
          user: "周婷",
          action: "尝试访问受限资源",
          module: "安全审计",
          time: "4小时前",
          status: "danger",
        },
        {
          id: 8,
          user: "吴磊",
          action: "完成了系统备份",
          module: "系统维护",
          time: "5小时前",
          status: "success",
        },
      ],
      msg: "一切ok",
    },
  },
]);
