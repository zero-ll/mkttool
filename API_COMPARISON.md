# 新旧版本对比分析报告

> **生成时间**: 2026-01-26  
> **分析基础**: OLD_BACKEND_SPEC.md vs BACKEND_GUIDE.md + PRD.md  
> **目标**: 明确可复用、需修改、需新增的接口和功能

---

## 📊 执行摘要

### 核心发现

| 类别 | 数量 | 占比 | 说明 |
|------|------|------|------|
| ✅ 可直接复用 | 8个接口 | ~25% | 基础设施和认证相关 |
| 🔄 需要修改 | 15个接口 | ~47% | 添加项目隔离、调整参数 |
| 🆕 需要新增 | 9个接口 | ~28% | 项目管理、排除红人等新功能 |
| **总计** | **32个接口** | **100%** | - |

### 数据库改造

| 改造类型 | 数量 | 说明 |
|---------|------|------|
| 需添加 project_id | 3张表 | spider_record, youtube_channel_rate, 新建表 |
| 需新建表 | 4张表 | projects, project_members, excluded_influencers, connected_influencers |
| 可复用表 | 2张表 | spider_record, youtube_channel_rate（需改造） |

### 工作量评估

- **可复用代码**: 约 35-40%（认证、YouTube API 封装、基础 CRUD）
- **需修改代码**: 约 45-50%（添加项目隔离逻辑）
- **需新增代码**: 约 10-15%（项目管理、排除红人）
- **预估工作量**: 2-3周（1人全职）

---

## 🔍 详细对比分析

### 1. 认证和用户管理

#### 1.1 用户登录

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `POST /auth/login` | `POST /api/auth/login` | ✅ 可复用 |
| **参数** | clientId, grantType, code, uuid | email, password | 🔄 需简化 |
| **响应** | JWT token + expire_in | user + token | 🔄 需调整 |
| **改造建议** | 简化为标准的 email/password 登录，保留 JWT 机制 |

#### 1.2 获取个人资料

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `GET /system/user/profile` | `GET /api/auth/me` | ✅ 可复用 |
| **改造建议** | 调整路径，简化响应字段 |

#### 1.3 退出登录

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `POST /auth/logout` | `POST /api/auth/logout` | ✅ 可复用 |
| **改造建议** | 无需改造 |

#### 1.4 用户注册

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | ❌ 不存在 | `POST /api/auth/register` | 🆕 需新增 |
| **改造建议** | 新增注册接口 |

---

### 2. 项目管理模块

#### 2.1 项目列表

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `GET /project/project/userReportOption` | `GET /api/projects` | 🔄 需改造 |
| **旧版功能** | 获取用户的项目列表（包含报告配置） | - | - |
| **新版需求** | 简化的项目列表（id, name, color, role） | - | - |
| **改造建议** | 简化响应字段，移除报告相关配置 |

#### 2.2 创建项目

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | ❌ 不存在 | `POST /api/projects` | 🆕 需新增 |
| **改造建议** | 新增项目创建接口 |

#### 2.3 更新/删除项目

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | ❌ 不存在 | `PATCH/DELETE /api/projects/:id` | 🆕 需新增 |
| **改造建议** | 新增项目管理接口 |

---

### 3. 红人搜索模块

#### 3.1 按关键词搜索

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `POST /spider/youtube/search` | `POST /api/projects/:projectId/tasks` | 🔄 需改造 |
| **参数对比** | | | |
| - 任务名称 | ✅ task_name | ✅ name | 字段名不同 |
| - 行业关键词 | ✅ keywords | ✅ industryKeywords | 字段名不同 |
| - 品牌关键词 | ✅ brand_name | ✅ brandKeywords | 字段名不同 |
| - 竞品关键词 | ✅ competing_product | ✅ competitorKeywords | 字段名不同 |
| - 单个关键词最大红人数 | ✅ video_max_result | ✅ maxInfluencers | 字段名不同 |
| - 排序方式 | ✅ order | ✅ sortBy | 字段名不同 |
| - 检索维度 | ✅ channel_search_type | ✅ targetRegion | 字段名不同 |
| - 国家偏好 | ✅ prefer_country | ✅ targetCountries | 单选→多选 |
| - 最小粉丝数 | ✅ min_subscribers | ✅ fanRangeValue + fanRangeOperator | 改为操作符+值 |
| - **项目ID** | ✅ project_id | ✅ projectId | **已有！** |
| - 排除已搜索 | ❌ 不存在 | ✅ excludeSearched | 🆕 新增 |
| - 排除去重 | ❌ 不存在 | ✅ excludeDeduplicated | 🆕 新增 |
| - P0/P1/P2类型 | ❌ 不存在 | ✅ p0Types, p1Types, p2Types | 🆕 新增 |

**改造建议**:
1. ✅ **好消息**: 旧版已支持 project_id，项目隔离基础已有
2. 🔄 调整参数命名，统一为驼峰命名
3. 🔄 国家偏好从单选改为多选数组
4. 🔄 粉丝数筛选改为操作符+值的方式
5. 🆕 添加排除逻辑（排除已搜索、排除去重）
6. 🆕 添加 P0/P1/P2 红人类型配置

#### 3.2 按红人ID搜索

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `POST /spider/youtube/excel_search` | `POST /api/projects/:projectId/tasks` | 🔄 需改造 |
| **改造建议** | 合并到统一的任务创建接口，通过 searchMethod 区分 |

#### 3.3 任务列表

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `GET /project/spiderRecord/list` | `GET /api/projects/:projectId/tasks` | 🔄 需改造 |
| **旧版参数** | projectId, spiderType, keyword, pageNum, pageSize | - | - |
| **新版参数** | projectId, status?, page?, limit? | - | - |
| **改造建议** | 1. 移除 spiderType 参数（新版只有一种任务类型）<br>2. 合并搜索和评估任务为统一的任务列表<br>3. 添加 searchMethod 字段区分搜索方式 |

#### 3.4 任务详情

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `GET /project/spiderRecord/detail/{id}` | `GET /api/tasks/:taskId` | ✅ 可复用 |
| **改造建议** | 调整响应字段，添加完整的 params 对象 |

#### 3.5 查看搜索结果

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `GET /project/channelInfo/list` | `GET /api/tasks/:taskId/results` | 🔄 需改造 |
| **旧版筛选** | subscriberCntLevel, country, orderBy, orderType | - | - |
| **新版筛选** | fanLevels[], countries[], influencerTypes[], hasEmail, qualityScoreMin/Max, matchScoreMin/Max, avgViewsMin/Max, cpmMin/Max | - | - |
| **改造建议** | 1. 扩展筛选参数（新增质量分、匹配度、均播、CPM筛选）<br>2. 粉丝量级改为多选<br>3. 添加红人类型筛选<br>4. 添加邮箱筛选 |

#### 3.6 国家下拉列表

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `GET /project/channelInfo/countryList/{uuid}` | - | ✅ 可复用 |
| **改造建议** | 前端可以使用此接口动态获取国家列表 |

#### 3.7 重命名任务

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `PUT /project/spiderRecord` | `PATCH /api/tasks/:taskId` | 🔄 需改造 |
| **改造建议** | 改为 RESTful 风格，使用 PATCH 方法 |

#### 3.8 删除任务

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | ❌ 不存在 | `DELETE /api/tasks/:taskId` | 🆕 需新增 |
| **改造建议** | 新增删除接口 |

#### 3.9 导出搜索结果

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `POST /spider/download` | - | ✅ 可复用 |
| **改造建议** | 前端可以直接使用 |

---

### 4. 红人评估模块

**⚠️ 重大变化**: 新版将"评估"功能整合到"任务详情"中，不再是独立的任务类型

| 功能 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **评估任务** | 独立的任务类型 | 整合到搜索任务的结果展示中 | 🔄 架构调整 |
| **评估报告** | 单独的列表页 | 任务详情页的筛选和列设置 | 🔄 UI整合 |
| **P0/P1/P2配置** | 创建评估任务时设置 | 创建搜索任务时设置 | 🔄 时机前移 |

#### 4.1 旧版评估相关接口处理建议

| 旧版接口 | 新版处理方式 | 说明 |
|---------|------------|------|
| `POST /project/spiderRecord/addChannelEvaluateTask` | ❌ 废弃 | 评估功能整合到搜索任务 |
| `GET /project/channelRate/list` (评估任务列表) | ❌ 废弃 | 合并到搜索任务列表 |
| `POST /project/channelRate/list` (查看评估报告) | 🔄 整合到 `GET /api/tasks/:taskId/results` | 筛选参数可复用 |
| `GET /project/channelRate/countryList/{uuid}` | ✅ 保留 | 用于动态获取国家列表 |
| `GET /project/channelRate/channelTypeList/{uuid}` | ✅ 保留 | 用于动态获取红人类型列表 |
| `POST /spider/download` (导出评估报告) | ✅ 保留 | 统一的导出接口 |

---

### 5. 红人建联模块

#### 5.1 标记建联

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `POST /project/channelRate/contactChannels` | `POST /api/projects/:projectId/connections` | 🔄 需改造 |
| **旧版逻辑** | 将 contacted 字段设为 true | - | - |
| **新版逻辑** | 创建 connected_influencers 记录 | - | - |
| **改造建议** | 1. 改为创建独立的建联记录<br>2. 记录来源任务（fromTaskId）<br>3. 记录添加人（addedBy） |

#### 5.2 建联列表

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `GET /project/channelRate/list?contacted=true` | `GET /api/projects/:projectId/connections` | 🔄 需改造 |
| **旧版字段** | channelId, channelTitle, subscriberCount, avatar, country, email, predictCpm, suggestedQuotation, homepage | - | - |
| **新版字段** | influencer{...}, fromTasks[], addedBy, addedAt | - | - |
| **改造建议** | 1. 添加来源任务列表（一个红人可能来自多个任务）<br>2. 添加添加人和添加时间<br>3. 支持筛选（hasEmail, searchTask, addedBy） |

#### 5.3 移除建联

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `POST /project/channelRate/removeContact/{ids}` | `DELETE /api/connections/:connectionId` | 🔄 需改造 |
| **旧版逻辑** | 将 contacted 设为 false | - | - |
| **新版逻辑** | 删除建联记录 | - | - |
| **改造建议** | 改为 RESTful 风格的删除接口 |

#### 5.4 导出建联列表

| 项目 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **接口** | `POST /project/channelRate/export` | - | ✅ 可复用 |
| **改造建议** | 前端自行生成 CSV（已实现） |

---

### 6. 排除红人管理

| 功能 | 旧版 | 新版 | 评估 |
|------|------|------|------|
| **上传排除名单** | ❌ 不存在 | `POST /api/projects/:projectId/exclusions/upload` | 🆕 需新增 |
| **排除列表** | ❌ 不存在 | `GET /api/projects/:projectId/exclusions` | 🆕 需新增 |
| **删除排除** | ❌ 不存在 | `DELETE /api/exclusions/:exclusionId` | 🆕 需新增 |

**改造建议**: 全新功能，需要新建表和接口

---

## 🗄️ 数据库改造方案

### 7.1 现有表改造

#### spider_record 表

**旧版字段**:
```sql
- uuid (主键)
- project_id (✅ 已有！)
- task_name (✅ 已有！)
- creator (✅ 已有！)
- spider_type (channel_search / channel_rate)
- status
- params (JSON)
- create_time
```

**需要的改造**:
```sql
-- 1. 移除 spider_type 字段（新版不区分搜索和评估）
ALTER TABLE youtube.spider_record DROP COLUMN spider_type;

-- 2. 在 params JSON 中添加 searchMethod 字段
-- 通过应用层处理，无需修改表结构

-- 3. 添加索引
CREATE INDEX project_id_IDX ON youtube.spider_record (project_id);
CREATE INDEX creator_IDX ON youtube.spider_record (creator);
```

#### youtube_channel_rate 表

**旧版字段**:
```sql
- id
- channel_id
- subscriber_cnt_level (✅ 已有！)
- avatar (✅ 已有！)
- contacted (✅ 已有！)
- ... (其他评分字段)
```

**需要的改造**:
```sql
-- 1. 添加 project_id 字段（用于项目隔离）
ALTER TABLE youtube.youtube_channel_rate 
ADD COLUMN project_id bigint 
COMMENT '项目ID';

-- 2. 添加索引
CREATE INDEX project_id_IDX ON youtube.youtube_channel_rate (project_id);

-- 3. contacted 字段改造
-- 旧版: true/false 标记是否联络
-- 新版: 改为独立的 connected_influencers 表
-- 建议: 保留此字段用于兼容，但新版使用独立表
```

### 7.2 需要新建的表

#### projects 表

```sql
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL COMMENT '项目名称',
    color VARCHAR(7) DEFAULT '#6366f1' COMMENT '项目颜色',
    description TEXT COMMENT '项目描述',
    owner_id BIGINT COMMENT '所有者ID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL COMMENT '软删除时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目表';
```

#### project_members 表

```sql
CREATE TABLE project_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL COMMENT '项目ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role VARCHAR(50) DEFAULT 'member' COMMENT '角色: admin/member/viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_project_user (project_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='项目成员表';
```

#### excluded_influencers 表

```sql
CREATE TABLE excluded_influencers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL COMMENT '项目ID',
    channel_id VARCHAR(255) NOT NULL COMMENT '频道ID',
    channel_name VARCHAR(255) COMMENT '频道名称',
    platform VARCHAR(50) DEFAULT 'youtube' COMMENT '平台',
    uploaded_by BIGINT COMMENT '上传人ID',
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    UNIQUE KEY unique_project_channel (project_id, channel_id),
    INDEX idx_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='排除红人表';
```

#### connected_influencers 表

```sql
CREATE TABLE connected_influencers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL COMMENT '项目ID',
    channel_id VARCHAR(255) NOT NULL COMMENT '频道ID',
    added_by BIGINT COMMENT '添加人ID',
    from_task_ids JSON COMMENT '来源任务ID列表',
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
    UNIQUE KEY unique_project_channel (project_id, channel_id),
    INDEX idx_project (project_id),
    INDEX idx_added_by (added_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='建联红人表';
```

### 7.3 可以废弃的表

```sql
-- spider_search_rate_mapping 表
-- 新版不再区分搜索和评估任务，此映射表可以废弃
DROP TABLE IF EXISTS youtube.spider_search_rate_mapping;
```

---

## 🔧 核心业务逻辑改造

### 8.1 任务创建流程对比

#### 旧版流程
```
1. 前端选择搜索方式（关键词/红人ID）
2. 调用不同接口创建任务
3. 后端创建 spider_record (type=channel_search)
4. 搜索完成后，用户手动创建评估任务
5. 后端创建新的 spider_record (type=channel_rate)
6. 创建映射关系
```

#### 新版流程
```
1. 前端选择搜索方式（关键词/红人ID）
2. 调用统一接口创建任务（params 中包含 searchMethod）
3. 后端创建 spider_record（无 type 字段）
4. 直接返回搜索结果和评分
5. 无需单独的评估任务
```

**改造要点**:
- ✅ 简化流程，减少一次任务创建
- ✅ 评分逻辑在搜索时就完成
- ✅ 前端通过筛选和列设置实现"评估"功能

### 8.2 项目隔离逻辑

**旧版**: 已有 project_id，但可能没有严格的权限校验

**新版需要**:
```java
// 所有接口都需要添加项目权限校验
public void checkProjectAccess(Long userId, Long projectId) {
    // 1. 检查用户是否是项目成员
    ProjectMember member = projectMemberRepository
        .findByProjectIdAndUserId(projectId, userId);
    
    if (member == null) {
        throw new ForbiddenException("无权访问此项目");
    }
    
    // 2. 检查项目是否已删除
    Project project = projectRepository.findById(projectId);
    if (project.getDeletedAt() != null) {
        throw new NotFoundException("项目不存在");
    }
}

// 所有查询都需要添加 project_id 过滤
List<Task> tasks = taskRepository
    .findByProjectId(projectId);  // 必须加上项目过滤
```

### 8.3 排除逻辑实现

**新增功能**: 搜索时需要排除两类红人

```java
public List<Channel> searchChannels(SearchParams params) {
    // 1. 调用 YouTube API 获取红人列表
    List<Channel> channels = youtubeApi.search(params);
    
    // 2. 排除已搜索过的红人（如果勾选）
    if (params.getExcludeSearched()) {
        Set<String> searchedChannelIds = getSearchedChannelIds(params.getProjectId());
        channels = channels.stream()
            .filter(c -> !searchedChannelIds.contains(c.getChannelId()))
            .collect(Collectors.toList());
    }
    
    // 3. 排除去重列表的红人（如果勾选）
    if (params.getExcludeDeduplicated()) {
        Set<String> excludedChannelIds = excludedInfluencerRepository
            .findChannelIdsByProjectId(params.getProjectId());
        channels = channels.stream()
            .filter(c -> !excludedChannelIds.contains(c.getChannelId()))
            .collect(Collectors.toList());
    }
    
    return channels;
}
```

---

## 📈 可复用的核心组件

### 9.1 完全可复用（无需修改）

✅ **YouTube API 封装**
- 搜索接口调用
- 频道信息获取
- 视频信息获取
- 配额管理
- 错误处理

✅ **认证机制**
- JWT 生成和验证
- Token 刷新
- 登录/登出逻辑

✅ **文件处理**
- Excel/CSV 解析
- 文件上传
- 文件下载

✅ **基础工具类**
- 日期处理
- 字符串工具
- 数字格式化

### 9.2 需要修改（添加项目隔离）

🔄 **数据访问层**
- 所有查询添加 project_id 过滤
- 所有插入添加 project_id 字段
- 添加项目权限校验

🔄 **业务逻辑层**
- 任务创建逻辑（合并搜索和评估）
- 搜索逻辑（添加排除功能）
- 评分逻辑（保持不变，但调用时机改变）

### 9.3 需要新增

🆕 **项目管理服务**
- 项目 CRUD
- 成员管理
- 权限校验

🆕 **排除红人服务**
- 上传解析
- 列表查询
- 删除操作

🆕 **建联管理服务**
- 建联记录创建
- 来源任务追踪
- 列表查询和导出

---

## 🎯 开发改造路线图

### Phase 1: 基础改造（第1周）

**目标**: 完成数据库改造和基础接口调整

- [ ] 数据库表结构改造
  - [ ] 新建 projects, project_members, excluded_influencers, connected_influencers 表
  - [ ] 修改 spider_record 表（添加索引）
  - [ ] 修改 youtube_channel_rate 表（添加 project_id）
- [ ] 认证接口调整
  - [ ] 简化登录接口
  - [ ] 新增注册接口
- [ ] 项目管理接口
  - [ ] 项目列表（改造现有接口）
  - [ ] 创建/更新/删除项目

**交付物**: 可以创建项目和登录的基础系统

### Phase 2: 任务管理改造（第2周）

**目标**: 完成任务创建和查询的改造

- [ ] 任务创建接口改造
  - [ ] 合并关键词搜索和红人ID搜索
  - [ ] 添加排除逻辑
  - [ ] 添加 P0/P1/P2 配置
- [ ] 任务列表接口改造
  - [ ] 合并搜索和评估任务
  - [ ] 添加 searchMethod 字段
- [ ] 任务详情和结果查询
  - [ ] 扩展筛选参数
  - [ ] 添加项目权限校验
- [ ] 任务操作接口
  - [ ] 重命名（改为 RESTful）
  - [ ] 删除（新增）

**交付物**: 可以创建任务、查看结果的完整搜索功能

### Phase 3: 建联和排除功能（第3周）

**目标**: 完成新增功能开发

- [ ] 排除红人管理
  - [ ] 上传接口
  - [ ] 列表查询
  - [ ] 删除接口
  - [ ] 搜索时的排除逻辑
- [ ] 建联管理改造
  - [ ] 改为独立表存储
  - [ ] 添加来源任务追踪
  - [ ] 列表查询（支持筛选）
  - [ ] 移除建联

**交付物**: 完整的排除和建联功能

### Phase 4: 测试和优化（第4周）

**目标**: 完成测试、优化和部署

- [ ] 接口测试
  - [ ] 单元测试
  - [ ] 集成测试
  - [ ] 前后端联调
- [ ] 性能优化
  - [ ] 查询优化
  - [ ] 索引优化
  - [ ] 缓存策略
- [ ] 文档完善
  - [ ] API 文档（Swagger）
  - [ ] 部署文档
  - [ ] 数据迁移文档

**交付物**: 生产就绪的完整系统

---

## ⚠️ 风险点和注意事项

### 10.1 数据迁移风险

**问题**: 如果旧版已有生产数据，如何迁移？

**建议**:
```sql
-- 1. 创建默认项目
INSERT INTO projects (name, color, description) 
VALUES ('默认项目', '#6366f1', '从旧版迁移的数据');

-- 2. 将所有旧数据关联到默认项目
UPDATE youtube.spider_record 
SET project_id = (SELECT id FROM projects WHERE name = '默认项目')
WHERE project_id IS NULL;

-- 3. 将所有用户添加到默认项目
INSERT INTO project_members (project_id, user_id, role)
SELECT 
    (SELECT id FROM projects WHERE name = '默认项目'),
    id,
    'admin'
FROM users;
```

### 10.2 API 兼容性

**问题**: 旧版前端可能还在使用旧接口

**建议**:
- 保留旧接口路径，内部调用新逻辑
- 添加版本号（/api/v1, /api/v2）
- 设置废弃警告和迁移期限

### 10.3 性能问题

**问题**: 添加项目隔离后，查询可能变慢

**建议**:
- 确保所有关联字段都有索引
- 使用 Redis 缓存项目成员关系
- 对大数据量表进行分区

---

## 📝 总结和建议

### 核心结论

1. **✅ 旧版基础很好**: 已有项目隔离基础（project_id），YouTube API 封装完善
2. **🔄 主要是调整**: 大部分工作是参数调整和业务逻辑优化，不是重写
3. **🆕 新增功能少**: 只有项目管理、排除红人是全新的
4. **⏱️ 工作量可控**: 预计 2-3 周可以完成改造

### 优先级建议

**P0 (必须完成)**:
- 数据库改造
- 任务创建和查询接口
- 项目管理基础接口

**P1 (重要)**:
- 建联管理改造
- 排除红人功能
- 权限校验完善

**P2 (可选)**:
- 性能优化
- 接口文档
- 单元测试

### 下一步行动

1. **确认改造方案** - 与后端团队确认此方案是否可行
2. **数据库改造** - 先在测试环境执行 SQL 脚本
3. **接口开发** - 按照 Phase 1-4 的顺序开发
4. **前后端联调** - 每完成一个 Phase 就进行联调

---

**文档完成时间**: 2026-01-26  
**预计改造周期**: 2-3 周  
**风险等级**: 低-中（大部分是调整，不是重写）
