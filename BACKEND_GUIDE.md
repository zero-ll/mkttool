# 后端开发架构指南

> **文档目的**: 为后端开发提供清晰的架构设计、接口规范和实现指南  
> **更新日期**: 2026-01-26  
> **状态**: 待开发

---

## 📊 系统架构概览

### 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         前端应用层                            │
│  React + Vite + TailwindCSS + React Router + Context API    │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTP/REST
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway 层                          │
│              认证、鉴权、请求日志、限流                        │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                       业务服务层                              │
│  ┌──────────┬───────────┬──────────┬────────────┬─────────┐│
│  │ 项目管理  │  任务管理  │ 红人搜索 │  建联管理  │ 用户管理 ││
│  └──────────┴───────────┴──────────┴────────────┴─────────┘│
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据持久层                               │
│     PostgreSQL (主数据) + Redis (缓存) + S3 (文件)           │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     外部服务集成                              │
│              YouTube Data API v3 + Email Service            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 前后端职责划分

### ✅ 前端职责
1. **UI/UX 交互**
   - 所有用户界面渲染
   - 表单验证（客户端）
   - 交互反馈和动画
   - 本地状态管理

2. **数据格式化**
   - 日期时间格式化
   - 数字千分位格式化
   - 标签/标记样式处理
   - CSV 导出生成

3. **路由和导航**
   - 客户端路由管理
   - 页面跳转控制
   - URL 参数处理

### ✅ 后端职责
1. **数据持久化**
   - 所有数据的增删改查
   - 数据关联和完整性
   - 事务管理

2. **业务逻辑**
   - 红人搜索算法
   - 质量评分计算
   - 业务匹配度计算
   - 数据去重逻辑

3. **外部集成**
   - YouTube API 调用
   - 邮件服务集成
   - 文件存储服务

4. **权限和安全**
   - 用户认证
   - 权限控制
   - 数据隔离（项目级）
   - API 限流

---

## 📦 数据模型设计

### 1. Projects (项目表)
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    description TEXT,
    owner_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### 2. Users (用户表)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Project Members (项目成员表)
```sql
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- admin, member, viewer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);
```

### 4. Search Tasks (搜索任务表)
```sql
CREATE TABLE search_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    search_method VARCHAR(50) NOT NULL, -- keyword, influencer_id
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, failed
    params JSONB NOT NULL,
    creator_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL
);
```

### 5. Influencers (红人基础表)
```sql
CREATE TABLE influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id VARCHAR(255) UNIQUE NOT NULL,
    channel_name VARCHAR(255) NOT NULL,
    handle VARCHAR(255),
    avatar_url TEXT,
    email VARCHAR(255),
    platform VARCHAR(50) DEFAULT 'youtube',
    country VARCHAR(100),
    subscriber_count BIGINT,
    view_count BIGINT,
    video_count INTEGER,
    channel_types TEXT[],
    -- 缓存字段（定期更新）
    avg_views_recent_10 BIGINT,
    engagement_rate DECIMAL(5,2),
    quality_score INTEGER,
    estimated_cpm DECIMAL(10,2),
    suggested_price_min DECIMAL(10,2),
    suggested_price_max DECIMAL(10,2),
    last_synced_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 6. Task Results (任务结果关联表)
```sql
CREATE TABLE task_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES search_tasks(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    match_score INTEGER, -- 业务匹配度
    rank_position INTEGER, -- 在结果中的排名
    metadata JSONB, -- 额外的评分细节
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(task_id, influencer_id)
);
```

### 7. Connected Influencers (建联红人表)
```sql
CREATE TABLE connected_influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    added_by UUID REFERENCES users(id),
    from_tasks UUID[], -- 来自哪些任务
    status VARCHAR(50) DEFAULT 'pending', -- pending, contacted, cooperating, rejected
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, influencer_id)
);
```

### 8. Excluded Influencers (排除红人表)
```sql
CREATE TABLE excluded_influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES influencers(id) ON DELETE CASCADE,
    uploaded_by UUID REFERENCES users(id),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, influencer_id)
);
```

---

## 🔌 核心 API 接口清单

### 认证 & 用户管理

#### `POST /api/auth/register`
- **功能**: 用户注册
- **权限**: 公开
- **请求体**: `{ email, name, password }`
- **返回**: `{ user, token }`

#### `POST /api/auth/login`
- **功能**: 用户登录
- **权限**: 公开
- **请求体**: `{ email, password }`
- **返回**: `{ user, token }`

#### `GET /api/auth/me`
- **功能**: 获取当前用户信息
- **权限**: 需要认证
- **返回**: `{ user }`

---

### 项目管理

#### `GET /api/projects`
- **功能**: 获取用户所有项目
- **权限**: 需要认证
- **返回**: `{ projects: [{ id, name, color, role, memberCount }] }`

#### `POST /api/projects`
- **功能**: 创建新项目
- **权限**: 需要认证
- **请求体**: `{ name, color?, description? }`
- **返回**: `{ project }`

#### `PATCH /api/projects/:projectId`
- **功能**: 更新项目信息
- **权限**: 项目管理员
- **请求体**: `{ name?, color?, description? }`
- **返回**: `{ project }`

#### `DELETE /api/projects/:projectId`
- **功能**: 删除项目
- **权限**: 项目所有者
- **返回**: `{ success: true }`

---

### 搜索任务管理

#### `GET /api/projects/:projectId/tasks`
- **功能**: 获取项目的所有任务
- **权限**: 项目成员
- **查询参数**: `status?, page?, limit?`
- **返回**: `{ tasks, total, page, pageSize }`

#### `POST /api/projects/:projectId/tasks`
- **功能**: 创建新任务
- **权限**: 项目成员
- **请求体**: 
  ```json
  {
    "name": "任务名称",
    "searchMethod": "keyword" | "influencer_id",
    "params": {
      "industryKeywords": ["科技", "数码"],
      "brandKeywords": [],
      "competitorKeywords": [],
      "maxInfluencers": 50,
      "targetCountries": ["美国", "英国"],
      "excludeSearched": true,
      "excludeDeduplicated": true,
      ...
    }
  }
  ```
- **返回**: `{ task }`
- **后端流程**:
  1. 验证项目权限
  2. 创建任务记录（状态：pending）
  3. 触发异步搜索任务
  4. 返回任务ID

#### `GET /api/tasks/:taskId`
- **功能**: 获取任务详情
- **权限**: 项目成员
- **返回**: `{ task, results }`

#### `GET /api/tasks/:taskId/results`
- **功能**: 获取任务结果（支持筛选）
- **权限**: 项目成员
- **查询参数**: 
  ```
  fanLevels[]=10万-50万&fanLevels[]=50万-100万
  countries[]=美国
  influencerTypes[]=美妆
  hasEmail=yes
  qualityScoreMin=60
  qualityScoreMax=100
  page=1
  limit=20
  ```
- **返回**: `{ results, total, page, pageSize }`

#### `DELETE /api/tasks/:taskId`
- **功能**: 删除任务
- **权限**: 任务创建者或项目管理员
- **返回**: `{ success: true }`

#### `PATCH /api/tasks/:taskId`
- **功能**: 重命名任务
- **权限**: 任务创建者或项目管理员
- **请求体**: `{ name }`
- **返回**: `{ task }`

---

### 红人搜索（核心业务逻辑）

#### 关键词搜索流程
1. **接收搜索参数**
2. **构建 YouTube API 查询**:
   ```
   q: 行业关键词 + 品牌关键词 + 竞品关键词
   type: video 或 channel
   order: relevance | viewCount | date
   regionCode: 国家代码
   maxResults: 50
   ```
3. **调用 YouTube Data API**:
   - `search.list` - 搜索视频/频道
   - `channels.list` - 获取频道详情
   - `videos.list` - 获取视频详情
4. **数据处理**:
   - 提取频道信息
   - 去重（基于 channel_id）
   - 应用排除规则（已搜索、去重列表）
   - 计算质量评分
   - 计算业务匹配度
5. **保存结果到数据库**
6. **返回结果**

#### 红人ID搜索流程
1. **解析上传文件** (Excel/CSV)
2. **提取 channel_id 列表**
3. **批量调用 YouTube API** 获取频道信息
4. **应用评分算法**
5. **保存并返回**

---

### 建联管理

#### `POST /api/projects/:projectId/connections`
- **功能**: 标记红人为待建联
- **权限**: 项目成员
- **请求体**: 
  ```json
  {
    "influencerId": "uuid",
    "fromTaskId": "uuid"
  }
  ```
- **返回**: `{ connection }`

#### `GET /api/projects/:projectId/connections`
- **功能**: 获取建联红人列表
- **权限**: 项目成员
- **查询参数**: `hasEmail?, searchTask?, addedBy?`
- **返回**: 
  ```json
  {
    "connections": [
      {
        "influencer": {...},
        "fromTasks": ["任务1", "任务2"],
        "addedBy": "用户名",
        "addedAt": "2024-01-20"
      }
    ]
  }
  ```

#### `DELETE /api/connections/:connectionId`
- **功能**: 取消建联标记
- **权限**: 项目成员
- **返回**: `{ success: true }`

---

### 排除红人管理

#### `POST /api/projects/:projectId/exclusions/upload`
- **功能**: 上传排除红人名单
- **权限**: 项目成员
- **请求**: `multipart/form-data` with file
- **文件格式**: Excel/CSV，必需列：`channel_id, channel_name, platform`
- **返回**: `{ success: true, imported: 10, skipped: 2 }`

#### `GET /api/projects/:projectId/exclusions`
- **功能**: 获取排除红人列表
- **权限**: 项目成员
- **查询参数**: `search?, page?, limit?`
- **返回**: `{ exclusions, total }`

#### `DELETE /api/exclusions/:exclusionId`
- **功能**: 删除排除红人
- **权限**: 项目成员
- **返回**: `{ success: true }`

---

## 🔐 认证和权限设计

### JWT Token 结构
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### 权限级别
1. **未认证**: 只能访问登录/注册接口
2. **已认证**: 可以创建项目、查看自己的项目
3. **项目成员**: 可以查看项目数据、创建任务、标记建联
4. **项目管理员**: 可以管理项目成员、修改项目设置
5. **项目所有者**: 可以删除项目

---

## 📊 YouTube API 使用说明

### 配额管理
- 每日配额：10,000 units
- `search.list`: 100 units/次
- `channels.list`: 1 unit/次  
- `videos.list`: 1 unit/次

### 优化策略
1. **结果缓存**: 相同查询 1小时内使用缓存
2. **批量请求**: 单次请求最多50个ID
3. **增量更新**: 只更新过期数据（>1周）
4. **降级策略**: 配额不足时使用缓存数据

---

## 🚀 后续开发建议

### Phase 1: 基础设施 (1-2周)
- [ ] 项目初始化（选择技术栈）
- [ ] 数据库设计和迁移脚本
- [ ] 认证系统（JWT）
- [ ] 基础 API 框架
- [ ] 错误处理和日志

### Phase 2: 核心功能 (2-3周)
- [ ] 项目管理 API
- [ ] 任务创建 API
- [ ] YouTube 搜索集成
- [ ] 评分算法实现
- [ ] 结果过滤和筛选

### Phase 3: 高级功能 (1-2周)
- [ ] 建联管理 API
- [ ] 排除红人管理
- [ ] 文件上传和解析
- [ ] 数据导出

### Phase 4: 优化和部署 (1周)
- [ ] 性能优化
- [ ] API 文档（Swagger）
- [ ] 单元测试
- [ ] 部署配置

---

## 💡 Planning 模式提示词建议

切换到 Planning 模式后，你可以使用以下提示词：

```
我有一个红人搜索系统前端应用已开发完成，现在需要设计和实现完整的后端架构。

**项目信息**：
- 前端：React + Vite，已完成所有UI和交互
- 目标：开发真实可用的产品
- 核心功能：红人搜索、任务管理、建联管理、项目数据隔离

**需要你帮我**：
1. 评估现有前端代码，确定所有需要的后端接口
2. 设计完整的数据库架构（支持多项目隔离）
3. 制定详细的开发计划和优先级
4. 提供技术栈选择建议（语言、框架、数据库）
5. 评估 YouTube API 集成方案和配额管理

**参考文档**：
- PRD.md：产品需求文档
- API_SPEC.md：前端期望的接口规范
- BACKEND_GUIDE.md：后端架构指南（刚创建的）

请提供一个完整的后端开发方案，包括架构设计、接口清单、开发步骤和预估时间。
```

---

**文档维护**: 随着开发进展持续更新
