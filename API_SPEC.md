# 红人搜索系统 - 接口需求文档 (API Specification)

> **版本**: v2.1  
> **更新日期**: 2026-01-27  
> **状态**: 开发中

---

## 📋 文档说明

本文档描述红人搜索系统所需的所有后端接口，包括接口描述、请求参数、响应数据和示例。

**接口规范**:
- 基础URL: `https://api.example.com`
- 认证方式: Bearer Token
- 请求头: `Authorization: Bearer {access_token}`
- 响应格式: JSON

---

## 🔐 1. 认证模块

### 1.1 用户登录

**接口路径**: `/auth/login`  
**请求方法**: `POST`  
**接口描述**: 用户登录认证，获取访问令牌

**请求参数**:
```json
{
  "clientId": "string",      // 客户端ID
  "grantType": "string",     // 授权类型
  "tenantId": "string",      // 租户ID
  "code": "string",          // 验证码
  "uuid": "string"           // 唯一标识
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOi...",
    "expire_in": 604799,
    "client_id": "e5cd7e4891bf95d1d19206ce24a7b32e"
  }
}
```

---

### 1.2 获取用户信息

**接口路径**: `/system/user/profile`  
**请求方法**: `GET`  
**接口描述**: 获取当前登录用户的个人信息

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "user": {
      "userId": 1,
      "userName": "admin",
      "nickName": "管理员",
      "email": "admin@example.com",
      "avatar": "https://example.com/avatar.png"
    }
  }
}
```

---

### 1.3 退出登录

**接口路径**: `/auth/logout`  
**请求方法**: `POST`  
**接口描述**: 退出登录，清除令牌

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": null
}
```

---

## 🏢 2. 项目管理模块

### 2.1 获取项目列表

**接口路径**: `/project/project/userReportOption`  
**请求方法**: `GET`  
**接口描述**: 获取当前用户有权限的所有项目列表

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "projectList": [
      {
        "projectId": 1,
        "projectName": "品牌A营销项目",
        "iconUrl": "https://example.com/icon.png",
        "createTime": "2026-01-01 10:00:00"
      },
      {
        "projectId": 2,
        "projectName": "品牌B推广项目",
        "iconUrl": "https://example.com/icon2.png",
        "createTime": "2026-01-15 14:30:00"
      }
    ]
  }
}
```

---

### 2.2 创建新项目 `[新接口]`

**接口路径**: `/project/project`  
**请求方法**: `POST`  
**接口描述**: 创建新的项目

**请求参数**:
```json
{
  "projectName": "string",    // 项目名称（必填）
  "description": "string",    // 项目描述（可选）
  "iconUrl": "string"         // 项目图标URL（可选）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "创建成功",
  "data": {
    "projectId": 3,
    "projectName": "新项目",
    "createTime": "2026-01-27 15:00:00"
  }
}
```

---

## 🔍 3. 搜索任务模块

### 3.1 获取任务列表

**接口路径**: `/project/spiderRecord/list`  
**请求方法**: `GET`  
**接口描述**: 获取指定项目下的搜索任务列表

**请求参数**:
```
?projectId=1                      // 项目ID（必填）
&spiderType=channel_search        // 任务类型：channel_search（必填）
&keyword=test                     // 搜索关键词（任务名称或创建人，可选）
&pageNum=1                        // 页码（可选，默认1）
&pageSize=10                      // 每页数量（可选，默认10）
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "total": 25,
    "list": [
      {
        "id": 1,
        "uuid": "ba8c51484269428ba8b0e69582ebf837",
        "taskName": "Q1科技产品红人搜索",
        "searchWay": "keywords",
        "status": "success",
        "resultCount": 156,
        "createTime": "2026-01-20 10:30:00",
        "creator": "张三"
      },
      {
        "id": 2,
        "uuid": "06f9671942ac4d8eafc54a4d69f567ca",
        "taskName": "竞品红人分析",
        "searchWay": "channelId",
        "status": "running",
        "resultCount": 0,
        "createTime": "2026-01-25 14:20:00",
        "creator": "李四"
      }
    ]
  }
}
```

**字段说明**:
- `searchWay`: `keywords` - 关键词搜索 | `channelId` - 红人ID搜索
- `status`: `init` - 初始化 | `running` - 运行中 | `success` - 成功 | `error` - 失败

---

### 3.2 创建关键词搜索任务

**接口路径**: `/spider/youtube/search`  
**请求方法**: `POST`  
**接口描述**: 创建基于关键词的红人搜索任务

**请求参数**:
```json
{
  "execute_type": "channel_search",     // 固定值
  "project_id": 1,                      // 项目ID（必填）
  "task_name": "Q1科技产品红人搜索",     // 任务名称（必填）
  "keywords": "智能家居,IoT,AI设备",      // 行业关键词（必填，逗号分隔）
  "brand_name": "品牌A,产品X",          // 本品关键词（必填，逗号分隔）
  "competing_product": "品牌B,品牌C",   // 竞品关键词（必填，逗号分隔）
  "video_max_result": 50,               // 单个关键词搜索视频数（必填）
  "order": "relevance",                 // 排序方式（必填）
  "prefer_country": "US,GB",            // 国家偏好（必填，逗号分隔）
  "channel_search_type": "video",       // 检索维度（必填）
  "min_subscribers": 10000,             // 最小粉丝数（可选）
  "p0_channel_types": "科技评测,开箱",   // P0频道类型（必填，逗号分隔）
  "p1_channel_types": "生活方式,DIY",    // P1频道类型（必填，逗号分隔）
  "p2_channel_types": "通用科技,新闻"    // P2频道类型（必填，逗号分隔）
}
```

**order 枚举值**:
- `relevance` - 相关性
- `viewCount` - 观看次数
- `date` - 发布日期

**channel_search_type 枚举值**:
- `video` - 按视频
- `channel` - 按频道

**prefer_country 枚举值**:
- `US` - 美国
- `GB` - 英国
- `FR` - 法国
- `DE` - 德国
- `JP` - 日本
- `AU` - 澳大利亚
- 等（参考旧文档）

**响应示例**:
```json
{
  "code": 200,
  "msg": "任务创建成功",
  "data": {
    "uuid": "ba8c51484269428ba8b0e69582ebf837",
    "taskName": "Q1科技产品红人搜索",
    "status": "init"
  }
}
```

**错误响应**:
```json
{
  "code": 400,
  "msg": "任务名称已存在",
  "data": null
}
```

---

### 3.3 创建红人ID搜索任务

**接口路径**: `/spider/youtube/excel_search`  
**请求方法**: `POST`  
**接口描述**: 通过上传Excel文件创建红人ID搜索任务

**请求参数**: FormData
```
file: [Excel文件]                     // Excel文件（必填）
project_id: 1                         // 项目ID（必填）
task_name: "竞品红人分析"              // 任务名称（必填）
keywords: "智能家居,IoT"               // 行业关键词（可选，逗号分隔）
brand_name: "品牌A"                   // 本品关键词（可选，逗号分隔）
competing_product: "品牌B,品牌C"      // 竞品关键词（可选，逗号分隔）
p0_channel_types: "科技评测"          // P0频道类型（可选，逗号分隔）
p1_channel_types: "生活方式"          // P1频道类型（可选，逗号分隔）
p2_channel_types: "通用科技"          // P2频道类型（可选，逗号分隔）
```

**Excel 文件格式要求**:
- 第一列：红人ID（channelId）
- 支持格式：.xlsx, .xls

**响应示例**:
```json
{
  "code": 200,
  "msg": "任务创建成功",
  "data": {
    "uuid": "06f9671942ac4d8eafc54a4d69f567ca",
    "taskName": "竞品红人分析",
    "channel_count": 25,
    "key_words": ["智能家居", "IoT"],
    "brand_name": ["品牌A"],
    "competing_product": ["品牌B", "品牌C"]
  }
}
```

---

### 3.4 获取任务详情

**接口路径**: `/project/spiderRecord/detail/{id}`  
**请求方法**: `GET`  
**接口描述**: 获取搜索任务的详细信息

**路径参数**:
- `id` - 任务ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "id": 1,
    "uuid": "ba8c51484269428ba8b0e69582ebf837",
    "taskName": "Q1科技产品红人搜索",
    "searchWay": "keywords",
    "creator": "张三",
    "createTime": "2026-01-20 10:30:00",
    "status": "success",
    "keywords": "智能家居,IoT,AI设备",
    "brandName": "品牌A,产品X",
    "competingProduct": "品牌B,品牌C",
    "videoMaxResult": 50,
    "order": "relevance",
    "channelSearchType": "video",
    "preferCountry": "US,GB",
    "minSubscribers": 10000,
    "p0ChannelTypes": "科技评测,开箱",
    "p1ChannelTypes": "生活方式,DIY",
    "p2ChannelTypes": "通用科技,新闻"
  }
}
```

---

### 3.5 重命名任务

**接口路径**: `/project/spiderRecord`  
**请求方法**: `PUT`  
**接口描述**: 重命名搜索任务

**请求参数**:
```json
{
  "id": 1,                           // 任务ID（必填）
  "taskName": "新任务名称",           // 新任务名称（必填）
  "spiderType": "channel_search"     // 任务类型（必填）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "重命名成功",
  "data": null
}
```

**错误响应**:
```json
{
  "code": 400,
  "msg": "任务名称已存在",
  "data": null
}
```

---

### 3.6 删除任务

**接口路径**: `/project/spiderRecord/{id}`  
**请求方法**: `DELETE`  
**接口描述**: 删除搜索任务

**路径参数**:
- `id` - 任务ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null
}
```

---

## 📊 4. 搜索结果模块

### 4.1 获取搜索结果列表

**接口路径**: `/project/channelInfo/list`  
**请求方法**: `GET`  
**接口描述**: 获取搜索任务的结果列表

**请求参数**:
```
?uuid=ba8c51484269428ba8b0e69582ebf837  // 任务UUID（必填）
&subscriberCntLevel=MEGA,TOP             // 粉丝量级（可选，逗号分隔）
&country=美国,英国                        // 国家（可选，逗号分隔）
&orderBy=subscriber_count                 // 排序字段（可选）
&orderType=desc                           // 排序方式（可选）
&pageNum=1                                // 页码（可选）
&pageSize=20                              // 每页数量（可选）
```

**subscriberCntLevel 枚举值**:
- `MEGA` - 超大型（>1000万）
- `TOP` - 顶级（500万-1000万）
- `MACRO` - 大型（100万-500万）
- `MID_UP` - 中上（50万-100万）
- `MID` - 中型（10万-50万）
- `MICRO_UP` - 微型偏上（5万-10万）
- `MICRO` - 微型（1万-5万）
- `NANO` - 纳米（<1万）

**orderBy 枚举值**:
- `subscriber_count` - 粉丝数
- `video_count` - 视频数
- `view_count` - 总观看次数
- `avg_views` - 平均观看量

**orderType 枚举值**:
- `desc` - 降序
- `asc` - 升序

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "total": 156,
    "list": [
      {
        "id": 1,
        "channelId": "UCxxxxxx",
        "channelTitle": "Tech Review Pro",
        "avatar": "https://example.com/avatar1.jpg",
        "homepage": "https://youtube.com/@techreviewpro",
        "subscriberCount": 1250000,
        "subscriberCntLevel": "MACRO",
        "country": "美国",
        "videoCount": 450,
        "viewCount": 125000000,
        "avgViews": 278000,
        "matchedKeywords": "智能家居,IoT",
        "seoKeywords": "smart home, IoT, AI",
        "description": "专注于智能家居产品评测的科技频道",
        "isCollaborated": false
      }
    ]
  }
}
```

---

### 4.2 获取国家筛选列表

**接口路径**: `/project/channelInfo/countryList/{uuid}`  
**请求方法**: `GET`  
**接口描述**: 获取指定搜索任务结果中的所有国家列表

**路径参数**:
- `uuid` - 任务UUID

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": ["美国", "英国", "加拿大", "澳大利亚"]
}
```

---

### 4.3 导出搜索结果

**接口路径**: `/spider/download`  
**请求方法**: `POST`  
**接口描述**: 导出搜索结果为Excel文件

**请求参数**: FormData
```
uuid: ba8c51484269428ba8b0e69582ebf837  // 任务UUID（必填）
```

**响应**: Excel文件下载流

**文件名格式**: `搜索结果_{任务名称}_{日期}.xlsx`

---

## 🤝 5. 建联管理模块

### 5.1 获取建联红人列表 `[新接口]`

**接口路径**: `/project/connections/list`  
**请求方法**: `GET`  
**接口描述**: 获取当前项目下已收藏/建联的红人列表

**请求参数**:
```
?projectId=1                    // 项目ID（必填）
&search=tech                    // 搜索关键词（可选）
&hasEmail=yes                   // Email状态：all/yes/no（可选）
&sourceTask=任务名称             // 来源任务（可选）
&addedBy=张三                   // 创建人（可选）
&pageNum=1                      // 页码（可选）
&pageSize=20                    // 每页数量（可选）
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "total": 45,
    "list": [
      {
        "id": 1,
        "channelId": "UCxxxxxx",
        "channelTitle": "Tech Review Pro",
        "avatar": "https://example.com/avatar1.jpg",
        "handle": "@techreviewpro",
        "email": "contact@techreview.com",
        "estimatedPrice": "¥5,000-8,000",
        "cpm": 8.5,
        "qualityScore": 85,
        "fromTasks": ["Q1科技产品红人搜索", "竞品分析"],
        "addedBy": "张三",
        "addedAt": "2026-01-20 15:30:00"
      }
    ]
  }
}
```

---

### 5.2 添加红人到建联列表 `[新接口]`

**接口路径**: `/project/connections/add`  
**请求方法**: `POST`  
**接口描述**: 将红人添加到建联列表（收藏）

**请求参数**:
```json
{
  "projectId": 1,                // 项目ID（必填）
  "channelId": "UCxxxxxx",       // 红人频道ID（必填）
  "sourceTaskUuid": "ba8c..."    // 来源任务UUID（必填）
}
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "添加成功",
  "data": {
    "id": 1,
    "channelId": "UCxxxxxx",
    "addedAt": "2026-01-27 16:00:00"
  }
}
```

---

### 5.3 从建联列表移除红人 `[新接口]`

**接口路径**: `/project/connections/{id}`  
**请求方法**: `DELETE`  
**接口描述**: 从建联列表中移除红人

**路径参数**:
- `id` - 建联记录ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "移除成功",
  "data": null
}
```

---

### 5.4 导出建联数据 `[新接口]`

**接口路径**: `/project/connections/export`  
**请求方法**: `POST`  
**接口描述**: 导出建联红人数据为Excel文件

**请求参数**: FormData
```
projectId: 1                    // 项目ID（必填）
```

**响应**: Excel文件下载流

**文件名格式**: `建联红人_{项目名称}_{日期}.xlsx`

---

## 🚫 6. 排除列表模块

### 6.1 上传排除红人 `[新接口]`

**接口路径**: `/project/exclusions/upload`  
**请求方法**: `POST`  
**接口描述**: 通过Excel文件批量上传排除红人

**请求参数**: FormData
```
file: [Excel文件]               // Excel文件（必填）
projectId: 1                    // 项目ID（必填）
```

**Excel 文件格式要求**:
- 第一列：红人ID（channelId）
- 支持格式：.xlsx, .xls

**响应示例**:
```json
{
  "code": 200,
  "msg": "上传成功",
  "data": {
    "total": 50,
    "success": 48,
    "failed": 2,
    "failedList": [
      {
        "channelId": "UCxxxxxx",
        "reason": "频道不存在"
      }
    ]
  }
}
```

---

### 6.2 获取排除列表 `[新接口]`

**接口路径**: `/project/exclusions/list`  
**请求方法**: `GET`  
**接口描述**: 获取当前项目的排除红人列表

**请求参数**:
```
?projectId=1                    // 项目ID（必填）
&pageNum=1                      // 页码（可选）
&pageSize=20                    // 每页数量（可选）
```

**响应示例**:
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    "total": 50,
    "list": [
      {
        "id": 1,
        "channelId": "UCxxxxxx",
        "channelTitle": "Excluded Channel",
        "avatar": "https://example.com/avatar.jpg",
        "addedBy": "张三",
        "addedAt": "2026-01-15 10:00:00"
      }
    ]
  }
}
```

---

### 6.3 删除排除红人 `[新接口]`

**接口路径**: `/project/exclusions/{id}`  
**请求方法**: `DELETE`  
**接口描述**: 从排除列表中删除红人

**路径参数**:
- `id` - 排除记录ID

**响应示例**:
```json
{
  "code": 200,
  "msg": "删除成功",
  "data": null
}
```

---

## 📝 7. 通用响应格式

### 成功响应
```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {
    // 具体数据
  }
}
```

### 错误响应
```json
{
  "code": 400,
  "msg": "错误描述",
  "data": null
}
```

### 常见错误码
- `200` - 成功
- `400` - 请求参数错误
- `401` - 未授权（Token无效或过期）
- `403` - 无权限访问
- `404` - 资源不存在
- `500` - 服务器内部错误

---

## 🔄 8. 接口变更记录

### v2.1 (2026-01-27)
**新增接口**:
- `POST /project/project` - 创建新项目
- `GET /project/connections/list` - 获取建联红人列表
- `POST /project/connections/add` - 添加红人到建联列表
- `DELETE /project/connections/{id}` - 从建联列表移除红人
- `POST /project/connections/export` - 导出建联数据
- `POST /project/exclusions/upload` - 上传排除红人
- `GET /project/exclusions/list` - 获取排除列表
- `DELETE /project/exclusions/{id}` - 删除排除红人

**修改接口**:
- `POST /spider/youtube/search` - 新增 P0/P1/P2 频道类型参数
- `POST /spider/youtube/excel_search` - 新增 P0/P1/P2 频道类型参数

### v2.0 (2026-01-26)
- 初始版本，基于旧版后端接口整理

---

## 📌 附录

### A. 数据字典

#### 粉丝量级 (subscriberCntLevel)
| 代码 | 名称 | 粉丝数范围 |
|------|------|-----------|
| MEGA | 超大型 | >10,000,000 |
| TOP | 顶级 | 5,000,000 - 10,000,000 |
| MACRO | 大型 | 1,000,000 - 5,000,000 |
| MID_UP | 中上 | 500,000 - 1,000,000 |
| MID | 中型 | 100,000 - 500,000 |
| MICRO_UP | 微型偏上 | 50,000 - 100,000 |
| MICRO | 微型 | 10,000 - 50,000 |
| NANO | 纳米 | <10,000 |

#### 任务状态 (status)
| 代码 | 名称 | 说明 |
|------|------|------|
| init | 初始化 | 任务已创建，等待执行 |
| running | 运行中 | 正在搜索和处理数据 |
| success | 成功 | 任务完成 |
| error | 失败 | 任务执行失败 |

#### 搜索方式 (searchWay)
| 代码 | 名称 | 说明 |
|------|------|------|
| keywords | 关键词搜索 | 通过关键词搜索红人 |
| channelId | 红人ID搜索 | 通过Excel上传红人ID |

---

## 🔗 相关文档

- [产品需求文档 (PRD)](./PRD.md)
- [旧版后端技术方案](./OLD_BACKEND_SPEC.md)
- [前端开发文档](./FRONTEND_DEV.md)
