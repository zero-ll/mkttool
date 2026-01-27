# 接口改造清单 - 直接执行版

> **目标**: 明确告诉后端开发：哪些接口能用、哪些要改、怎么改、哪些要新增

---

## 📋 快速总览

| 模块 | 能直接用 | 要修改 | 要新增 | 总计 |
|------|---------|--------|--------|------|
| 认证 | 2个 | 1个 | 1个 | 4个 |
| 项目管理 | 0个 | 1个 | 3个 | 4个 |
| 任务管理 | 1个 | 6个 | 2个 | 9个 |
| 建联管理 | 0个 | 3个 | 0个 | 3个 |
| 排除红人 | 0个 | 0个 | 3个 | 3个 |
| **合计** | **3个** | **11个** | **9个** | **23个** |

---

## ✅ 能直接用的接口（3个）

### 1. 退出登录
```
旧接口: POST /auth/logout
新接口: POST /api/auth/logout
改动: 只需调整路径前缀
```

### 2. 获取个人资料
```
旧接口: GET /system/user/profile
新接口: GET /api/auth/me
改动: 调整路径，简化响应字段
```

### 3. 导出功能
```
旧接口: POST /spider/download
新接口: 前端直接调用
改动: 无需改动，前端可直接使用
```

---

## 🔄 要修改的接口（11个）

### 【认证模块】

#### 1. 用户登录 - 需简化

**旧接口**:
```http
POST /auth/login
{
  "clientId": "",
  "grantType": "",
  "tenantId": "",
  "code": "",
  "uuid": ""
}
```

**新接口**:
```http
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "123456"
}
```

**改造方法**:
```java
// 旧代码（复杂的多租户登录）
@PostMapping("/auth/login")
public R login(@RequestBody LoginRequest request) {
    // 验证 clientId, grantType, tenantId...
    // 生成 JWT token
}

// 新代码（简化为标准登录）
@PostMapping("/api/auth/login")
public R login(@RequestBody LoginRequest request) {
    // 1. 验证 email + password
    User user = userService.authenticate(request.getEmail(), request.getPassword());
    
    // 2. 生成 JWT token（保留原有逻辑）
    String token = jwtService.generateToken(user);
    
    // 3. 返回简化响应
    return R.ok(Map.of(
        "user", user,
        "token", token,
        "expire_in", 604799
    ));
}
```

---

### 【项目管理模块】

#### 2. 项目列表 - 需简化

**旧接口**:
```http
GET /project/project/userReportOption
返回: 复杂的项目配置（包含报告、算法等）
```

**新接口**:
```http
GET /api/projects
返回: 简化的项目列表
```

**改造方法**:
```java
// 旧代码
@GetMapping("/project/project/userReportOption")
public R getUserProjects() {
    // 返回包含 adsCostReport, biReport, algorithmList 等复杂配置
}

// 新代码（简化）
@GetMapping("/api/projects")
public R getProjects(@RequestHeader("Authorization") String token) {
    Long userId = jwtService.getUserId(token);
    
    List<Project> projects = projectService.getUserProjects(userId);
    
    // 只返回基础信息
    return R.ok(projects.stream().map(p -> Map.of(
        "id", p.getId(),
        "name", p.getName(),
        "color", p.getColor(),
        "role", p.getRole(),  // 从 project_members 表获取
        "memberCount", p.getMemberCount()
    )).collect(Collectors.toList()));
}
```

---

### 【任务管理模块】

#### 3. 创建任务（关键词搜索）- 需调整参数

**旧接口**:
```http
POST /spider/youtube/search
{
  "project_id": 1,
  "task_name": "测试任务",
  "keywords": "test",
  "brand_name": "test",
  "competing_product": "test",
  "video_max_result": 50,
  "order": "viewCount",
  "channel_search_type": "channel",
  "prefer_country": "US",
  "min_subscribers": 200
}
```

**新接口**:
```http
POST /api/projects/:projectId/tasks
{
  "name": "测试任务",
  "searchMethod": "keyword",
  "params": {
    "industryKeywords": ["test"],
    "brandKeywords": ["test"],
    "competitorKeywords": ["test"],
    "maxInfluencers": 50,
    "sortBy": "viewCount",
    "targetRegion": "按视频",
    "targetCountries": ["美国", "英国"],
    "fanRangeOperator": ">=",
    "fanRangeValue": "200",
    "excludeSearched": true,
    "excludeDeduplicated": true,
    "p0Types": [],
    "p1Types": [],
    "p2Types": []
  }
}
```

**改造方法**:
```java
@PostMapping("/api/projects/{projectId}/tasks")
public R createTask(
    @PathVariable Long projectId,
    @RequestBody CreateTaskRequest request,
    @RequestHeader("Authorization") String token
) {
    // 1. 权限校验
    Long userId = jwtService.getUserId(token);
    projectService.checkAccess(userId, projectId);
    
    // 2. 参数转换（新→旧）
    SpiderRequest spiderRequest = new SpiderRequest();
    spiderRequest.setProjectId(projectId);
    spiderRequest.setTaskName(request.getName());
    spiderRequest.setCreator(userId.toString());
    
    // 关键词处理（数组→逗号分隔字符串）
    spiderRequest.setKeywords(String.join(",", request.getParams().getIndustryKeywords()));
    spiderRequest.setBrandName(String.join(",", request.getParams().getBrandKeywords()));
    spiderRequest.setCompetingProduct(String.join(",", request.getParams().getCompetitorKeywords()));
    
    // 其他参数映射
    spiderRequest.setVideoMaxResult(request.getParams().getMaxInfluencers());
    spiderRequest.setOrder(request.getParams().getSortBy());
    spiderRequest.setChannelSearchType(mapTargetRegion(request.getParams().getTargetRegion()));
    
    // 国家处理（多选→单选，取第一个）
    if (!request.getParams().getTargetCountries().isEmpty()) {
        spiderRequest.setPreferCountry(
            mapCountryName(request.getParams().getTargetCountries().get(0))
        );
    }
    
    // 粉丝数处理
    spiderRequest.setMinSubscribers(
        Integer.parseInt(request.getParams().getFanRangeValue())
    );
    
    // 3. 保存 searchMethod 到 params JSON
    Map<String, Object> params = new HashMap<>();
    params.put("searchMethod", request.getSearchMethod());
    params.put("excludeSearched", request.getParams().getExcludeSearched());
    params.put("excludeDeduplicated", request.getParams().getExcludeDeduplicated());
    params.put("p0Types", request.getParams().getP0Types());
    params.put("p1Types", request.getParams().getP1Types());
    params.put("p2Types", request.getParams().getP2Types());
    spiderRequest.setParams(JSON.toJSONString(params));
    
    // 4. 调用原有搜索逻辑
    String uuid = youtubeSpiderService.search(spiderRequest);
    
    return R.ok(Map.of("uuid", uuid));
}

// 辅助方法：映射国家名称
private String mapCountryName(String chineseName) {
    Map<String, String> countryMap = Map.of(
        "美国", "US",
        "英国", "GB",
        "法国", "FR",
        "德国", "DE"
        // ... 其他国家
    );
    return countryMap.getOrDefault(chineseName, "US");
}

// 辅助方法：映射搜索维度
private String mapTargetRegion(String region) {
    return "按视频".equals(region) ? "video" : "channel";
}
```

#### 4. 创建任务（红人ID搜索）- 合并到统一接口

**旧接口**:
```http
POST /spider/youtube/excel_search
FormData: file, project_id, task_name, keywords, brand_name, competing_product
```

**新接口**: 同上，通过 `searchMethod: "influencer_id"` 区分

**改造方法**:
```java
@PostMapping("/api/projects/{projectId}/tasks")
public R createTask(...) {
    if ("influencer_id".equals(request.getSearchMethod())) {
        // 调用原有的 excel_search 逻辑
        return handleExcelSearch(projectId, request, userId);
    } else {
        // 调用原有的 keyword search 逻辑
        return handleKeywordSearch(projectId, request, userId);
    }
}
```

#### 5. 任务列表 - 需合并搜索和评估任务

**旧接口**:
```http
GET /project/spiderRecord/list?projectId=1&spiderType=channel_search
返回: 只有搜索任务
```

**新接口**:
```http
GET /api/projects/:projectId/tasks
返回: 所有任务（不区分类型）
```

**改造方法**:
```java
@GetMapping("/api/projects/{projectId}/tasks")
public R getTasks(
    @PathVariable Long projectId,
    @RequestParam(required = false) String status,
    @RequestParam(defaultValue = "1") Integer page,
    @RequestParam(defaultValue = "10") Integer limit
) {
    // 1. 查询所有任务（移除 spiderType 过滤）
    List<SpiderRecord> records = spiderRecordService.findByProjectId(
        projectId, status, page, limit
    );
    
    // 2. 从 params JSON 中提取 searchMethod
    return R.ok(records.stream().map(record -> {
        Map<String, Object> params = JSON.parseObject(record.getParams());
        
        return Map.of(
            "id", record.getUuid(),
            "name", record.getTaskName(),
            "searchMethod", params.getOrDefault("searchMethod", "keyword"),
            "status", record.getStatus(),
            "createdAt", record.getCreateTime(),
            "creator", record.getCreator()
        );
    }).collect(Collectors.toList()));
}
```

#### 6. 查看搜索结果 - 需扩展筛选参数

**旧接口**:
```http
GET /project/channelInfo/list?uuid=xxx&subscriberCntLevel=MEGA&country=美国
支持: 粉丝量级、国家、排序
```

**新接口**:
```http
GET /api/tasks/:taskId/results?fanLevels[]=MEGA&countries[]=美国&hasEmail=yes&qualityScoreMin=60...
支持: 粉丝量级(多选)、国家(多选)、红人类型、邮箱、质量分、匹配度、均播、CPM
```

**改造方法**:
```java
@GetMapping("/api/tasks/{taskId}/results")
public R getResults(
    @PathVariable String taskId,
    @RequestParam(required = false) List<String> fanLevels,
    @RequestParam(required = false) List<String> countries,
    @RequestParam(required = false) List<String> influencerTypes,
    @RequestParam(required = false) String hasEmail,
    @RequestParam(required = false) Integer qualityScoreMin,
    @RequestParam(required = false) Integer qualityScoreMax,
    @RequestParam(required = false) Integer matchScoreMin,
    @RequestParam(required = false) Integer matchScoreMax,
    @RequestParam(required = false) Long avgViewsMin,
    @RequestParam(required = false) Long avgViewsMax,
    @RequestParam(required = false) Double cpmMin,
    @RequestParam(required = false) Double cpmMax
) {
    // 1. 调用原有查询逻辑
    List<ChannelInfo> channels = channelInfoService.findByUuid(taskId);
    
    // 2. 应用新增的筛选条件
    Stream<ChannelInfo> stream = channels.stream();
    
    // 粉丝量级（改为多选）
    if (fanLevels != null && !fanLevels.isEmpty()) {
        stream = stream.filter(c -> fanLevels.contains(c.getSubscriberCntLevel()));
    }
    
    // 国家（改为多选）
    if (countries != null && !countries.isEmpty()) {
        stream = stream.filter(c -> countries.contains(c.getCountry()));
    }
    
    // 红人类型（新增）
    if (influencerTypes != null && !influencerTypes.isEmpty()) {
        stream = stream.filter(c -> 
            influencerTypes.stream().anyMatch(type -> 
                c.getChannelType() != null && c.getChannelType().contains(type)
            )
        );
    }
    
    // 邮箱筛选（新增）
    if ("yes".equals(hasEmail)) {
        stream = stream.filter(c -> c.getEmail() != null && !c.getEmail().isEmpty());
    } else if ("no".equals(hasEmail)) {
        stream = stream.filter(c -> c.getEmail() == null || c.getEmail().isEmpty());
    }
    
    // 质量分筛选（新增）
    if (qualityScoreMin != null) {
        stream = stream.filter(c -> c.getChannelQualityScore() >= qualityScoreMin);
    }
    if (qualityScoreMax != null) {
        stream = stream.filter(c -> c.getChannelQualityScore() <= qualityScoreMax);
    }
    
    // 业务匹配度筛选（新增）
    if (matchScoreMin != null) {
        stream = stream.filter(c -> c.getBizMatchingScore() >= matchScoreMin);
    }
    if (matchScoreMax != null) {
        stream = stream.filter(c -> c.getBizMatchingScore() <= matchScoreMax);
    }
    
    // 均播筛选（新增）
    if (avgViewsMin != null) {
        stream = stream.filter(c -> c.getRecAvgViewCnt() >= avgViewsMin);
    }
    if (avgViewsMax != null) {
        stream = stream.filter(c -> c.getRecAvgViewCnt() <= avgViewsMax);
    }
    
    // CPM筛选（新增）
    if (cpmMin != null) {
        stream = stream.filter(c -> 
            c.getPredictCpm() != null && 
            Double.parseDouble(c.getPredictCpm()) >= cpmMin
        );
    }
    if (cpmMax != null) {
        stream = stream.filter(c -> 
            c.getPredictCpm() != null && 
            Double.parseDouble(c.getPredictCpm()) <= cpmMax
        );
    }
    
    return R.ok(stream.collect(Collectors.toList()));
}
```

#### 7. 任务详情 - 需调整响应格式

**旧接口**:
```http
GET /project/spiderRecord/detail/{id}
返回: 扁平的字段
```

**新接口**:
```http
GET /api/tasks/:taskId
返回: task + params 对象
```

**改造方法**:
```java
@GetMapping("/api/tasks/{taskId}")
public R getTaskDetail(@PathVariable String taskId) {
    SpiderRecord record = spiderRecordService.findByUuid(taskId);
    
    // 解析 params JSON
    Map<String, Object> params = JSON.parseObject(record.getParams());
    
    return R.ok(Map.of(
        "task", Map.of(
            "id", record.getUuid(),
            "name", record.getTaskName(),
            "searchMethod", params.get("searchMethod"),
            "status", record.getStatus(),
            "creator", record.getCreator(),
            "createdAt", record.getCreateTime()
        ),
        "params", params
    ));
}
```

#### 8. 重命名任务 - 改为 RESTful 风格

**旧接口**:
```http
PUT /project/spiderRecord
{ "id": 1222, "taskName": "新名称", "spiderType": "channel_search" }
```

**新接口**:
```http
PATCH /api/tasks/:taskId
{ "name": "新名称" }
```

**改造方法**:
```java
@PatchMapping("/api/tasks/{taskId}")
public R renameTask(
    @PathVariable String taskId,
    @RequestBody Map<String, String> request
) {
    // 调用原有逻辑
    spiderRecordService.updateTaskName(taskId, request.get("name"));
    return R.ok();
}
```

#### 9. 国家下拉列表 - 直接用

**旧接口**:
```http
GET /project/channelInfo/countryList/{uuid}
```

**新接口**: 前端直接调用旧接口

---

### 【建联管理模块】

#### 10. 标记建联 - 需改为创建记录

**旧接口**:
```http
POST /project/channelRate/contactChannels
[{ "id": 1, "channelId": "xxx" }]
逻辑: 将 contacted 字段设为 true
```

**新接口**:
```http
POST /api/projects/:projectId/connections
{ "influencerId": "uuid", "fromTaskId": "uuid" }
逻辑: 创建 connected_influencers 记录
```

**改造方法**:
```java
@PostMapping("/api/projects/{projectId}/connections")
public R addConnection(
    @PathVariable Long projectId,
    @RequestBody AddConnectionRequest request,
    @RequestHeader("Authorization") String token
) {
    Long userId = jwtService.getUserId(token);
    
    // 1. 检查是否已存在
    ConnectedInfluencer existing = connectedInfluencerRepository
        .findByProjectIdAndChannelId(projectId, request.getInfluencerId());
    
    if (existing != null) {
        // 已存在，添加新的来源任务
        List<String> fromTasks = JSON.parseArray(existing.getFromTaskIds(), String.class);
        if (!fromTasks.contains(request.getFromTaskId())) {
            fromTasks.add(request.getFromTaskId());
            existing.setFromTaskIds(JSON.toJSONString(fromTasks));
            connectedInfluencerRepository.save(existing);
        }
    } else {
        // 不存在，创建新记录
        ConnectedInfluencer connection = new ConnectedInfluencer();
        connection.setProjectId(projectId);
        connection.setChannelId(request.getInfluencerId());
        connection.setAddedBy(userId);
        connection.setFromTaskIds(JSON.toJSONString(List.of(request.getFromTaskId())));
        connectedInfluencerRepository.save(connection);
    }
    
    // 2. 同时更新旧的 contacted 字段（兼容）
    channelRateService.updateContacted(request.getInfluencerId(), true);
    
    return R.ok();
}
```

#### 11. 建联列表 - 需添加来源任务

**旧接口**:
```http
GET /project/channelRate/list?projectId=1&contacted=true
返回: 红人基本信息
```

**新接口**:
```http
GET /api/projects/:projectId/connections?hasEmail=yes&searchTask=xxx&addedBy=xxx
返回: 红人信息 + fromTasks + addedBy + addedAt
```

**改造方法**:
```java
@GetMapping("/api/projects/{projectId}/connections")
public R getConnections(
    @PathVariable Long projectId,
    @RequestParam(required = false) String hasEmail,
    @RequestParam(required = false) String searchTask,
    @RequestParam(required = false) String addedBy
) {
    // 1. 查询建联记录
    List<ConnectedInfluencer> connections = connectedInfluencerRepository
        .findByProjectId(projectId);
    
    // 2. 应用筛选
    Stream<ConnectedInfluencer> stream = connections.stream();
    
    if (searchTask != null) {
        stream = stream.filter(c -> {
            List<String> tasks = JSON.parseArray(c.getFromTaskIds(), String.class);
            return tasks.contains(searchTask);
        });
    }
    
    if (addedBy != null) {
        stream = stream.filter(c -> addedBy.equals(c.getAddedBy().toString()));
    }
    
    // 3. 获取红人详细信息
    List<Map<String, Object>> result = stream.map(connection -> {
        // 从 youtube_channel_rate 表获取红人信息
        ChannelRate channel = channelRateService.findByChannelId(connection.getChannelId());
        
        // 邮箱筛选
        if ("yes".equals(hasEmail) && (channel.getEmail() == null || channel.getEmail().isEmpty())) {
            return null;
        }
        if ("no".equals(hasEmail) && channel.getEmail() != null && !channel.getEmail().isEmpty()) {
            return null;
        }
        
        // 获取任务名称列表
        List<String> taskIds = JSON.parseArray(connection.getFromTaskIds(), String.class);
        List<String> taskNames = taskIds.stream()
            .map(id -> spiderRecordService.findByUuid(id).getTaskName())
            .collect(Collectors.toList());
        
        return Map.of(
            "influencer", Map.of(
                "id", channel.getChannelId(),
                "name", channel.getChannelTitle(),
                "avatar", channel.getAvatar(),
                "handle", channel.getHomepage(),
                "email", channel.getEmail()
            ),
            "estimatedPrice", channel.getSuggestedQuotation(),
            "cpm", channel.getPredictCpm(),
            "qualityScore", channel.getChannelQualityScore(),
            "fromTasks", taskNames,
            "addedBy", userService.findById(connection.getAddedBy()).getName(),
            "addedAt", connection.getAddedAt()
        );
    })
    .filter(Objects::nonNull)
    .collect(Collectors.toList());
    
    return R.ok(result);
}
```

#### 12. 移除建联 - 改为删除记录

**旧接口**:
```http
POST /project/channelRate/removeContact/{ids}
逻辑: 将 contacted 设为 false
```

**新接口**:
```http
DELETE /api/connections/:connectionId
逻辑: 删除 connected_influencers 记录
```

**改造方法**:
```java
@DeleteMapping("/api/connections/{connectionId}")
public R removeConnection(@PathVariable Long connectionId) {
    ConnectedInfluencer connection = connectedInfluencerRepository
        .findById(connectionId)
        .orElseThrow(() -> new NotFoundException("建联记录不存在"));
    
    // 1. 删除建联记录
    connectedInfluencerRepository.delete(connection);
    
    // 2. 同时更新旧的 contacted 字段（兼容）
    channelRateService.updateContacted(connection.getChannelId(), false);
    
    return R.ok();
}
```

---

## 🆕 要新增的接口（9个）

### 【认证模块】

#### 1. 用户注册

```java
@PostMapping("/api/auth/register")
public R register(@RequestBody RegisterRequest request) {
    // 1. 验证邮箱是否已存在
    if (userService.existsByEmail(request.getEmail())) {
        return R.error("邮箱已被注册");
    }
    
    // 2. 创建用户
    User user = new User();
    user.setEmail(request.getEmail());
    user.setName(request.getName());
    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
    userService.save(user);
    
    // 3. 生成 token
    String token = jwtService.generateToken(user);
    
    return R.ok(Map.of(
        "user", user,
        "token", token
    ));
}
```

---

### 【项目管理模块】

#### 2. 创建项目

```java
@PostMapping("/api/projects")
public R createProject(
    @RequestBody CreateProjectRequest request,
    @RequestHeader("Authorization") String token
) {
    Long userId = jwtService.getUserId(token);
    
    // 1. 创建项目
    Project project = new Project();
    project.setName(request.getName());
    project.setColor(request.getColor());
    project.setDescription(request.getDescription());
    project.setOwnerId(userId);
    projectRepository.save(project);
    
    // 2. 添加创建者为管理员
    ProjectMember member = new ProjectMember();
    member.setProjectId(project.getId());
    member.setUserId(userId);
    member.setRole("admin");
    projectMemberRepository.save(member);
    
    return R.ok(project);
}
```

#### 3. 更新项目

```java
@PatchMapping("/api/projects/{projectId}")
public R updateProject(
    @PathVariable Long projectId,
    @RequestBody UpdateProjectRequest request,
    @RequestHeader("Authorization") String token
) {
    Long userId = jwtService.getUserId(token);
    
    // 1. 权限校验（必须是管理员）
    projectService.checkAdminAccess(userId, projectId);
    
    // 2. 更新项目
    Project project = projectRepository.findById(projectId)
        .orElseThrow(() -> new NotFoundException("项目不存在"));
    
    if (request.getName() != null) {
        project.setName(request.getName());
    }
    if (request.getColor() != null) {
        project.setColor(request.getColor());
    }
    if (request.getDescription() != null) {
        project.setDescription(request.getDescription());
    }
    
    projectRepository.save(project);
    return R.ok(project);
}
```

#### 4. 删除项目

```java
@DeleteMapping("/api/projects/{projectId}")
public R deleteProject(
    @PathVariable Long projectId,
    @RequestHeader("Authorization") String token
) {
    Long userId = jwtService.getUserId(token);
    
    // 1. 权限校验（必须是所有者）
    Project project = projectRepository.findById(projectId)
        .orElseThrow(() -> new NotFoundException("项目不存在"));
    
    if (!project.getOwnerId().equals(userId)) {
        return R.error("只有项目所有者可以删除项目");
    }
    
    // 2. 软删除
    project.setDeletedAt(new Date());
    projectRepository.save(project);
    
    return R.ok();
}
```

---

### 【任务管理模块】

#### 5. 删除任务

```java
@DeleteMapping("/api/tasks/{taskId}")
public R deleteTask(
    @PathVariable String taskId,
    @RequestHeader("Authorization") String token
) {
    Long userId = jwtService.getUserId(token);
    
    // 1. 获取任务
    SpiderRecord task = spiderRecordService.findByUuid(taskId);
    
    // 2. 权限校验（创建者或项目管理员）
    if (!task.getCreator().equals(userId.toString())) {
        projectService.checkAdminAccess(userId, task.getProjectId());
    }
    
    // 3. 删除任务
    spiderRecordService.delete(taskId);
    
    return R.ok();
}
```

---

### 【排除红人管理模块】

#### 6. 上传排除名单

```java
@PostMapping("/api/projects/{projectId}/exclusions/upload")
public R uploadExclusions(
    @PathVariable Long projectId,
    @RequestParam("file") MultipartFile file,
    @RequestHeader("Authorization") String token
) {
    Long userId = jwtService.getUserId(token);
    
    // 1. 权限校验
    projectService.checkAccess(userId, projectId);
    
    // 2. 解析 Excel/CSV
    List<ExclusionData> data = excelService.parseExclusionFile(file);
    
    // 3. 批量插入
    int imported = 0;
    int skipped = 0;
    
    for (ExclusionData item : data) {
        // 检查是否已存在
        if (excludedInfluencerRepository.existsByProjectIdAndChannelId(
            projectId, item.getChannelId()
        )) {
            skipped++;
            continue;
        }
        
        ExcludedInfluencer exclusion = new ExcludedInfluencer();
        exclusion.setProjectId(projectId);
        exclusion.setChannelId(item.getChannelId());
        exclusion.setChannelName(item.getChannelName());
        exclusion.setPlatform(item.getPlatform());
        exclusion.setUploadedBy(userId);
        excludedInfluencerRepository.save(exclusion);
        
        imported++;
    }
    
    return R.ok(Map.of(
        "success", true,
        "imported", imported,
        "skipped", skipped
    ));
}
```

#### 7. 排除列表

```java
@GetMapping("/api/projects/{projectId}/exclusions")
public R getExclusions(
    @PathVariable Long projectId,
    @RequestParam(required = false) String search,
    @RequestParam(defaultValue = "1") Integer page,
    @RequestParam(defaultValue = "10") Integer limit
) {
    // 1. 查询排除列表
    Page<ExcludedInfluencer> exclusions = excludedInfluencerRepository
        .findByProjectId(projectId, search, PageRequest.of(page - 1, limit));
    
    return R.ok(Map.of(
        "exclusions", exclusions.getContent(),
        "total", exclusions.getTotalElements()
    ));
}
```

#### 8. 删除排除

```java
@DeleteMapping("/api/exclusions/{exclusionId}")
public R deleteExclusion(@PathVariable Long exclusionId) {
    excludedInfluencerRepository.deleteById(exclusionId);
    return R.ok();
}
```

---

## 📊 数据库改造 SQL

### 新建表

```sql
-- 1. 项目表
CREATE TABLE projects (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7) DEFAULT '#6366f1',
    description TEXT,
    owner_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. 项目成员表
CREATE TABLE project_members (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (project_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 排除红人表
CREATE TABLE excluded_influencers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    channel_name VARCHAR(255),
    platform VARCHAR(50) DEFAULT 'youtube',
    uploaded_by BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (project_id, channel_id),
    INDEX idx_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 建联红人表
CREATE TABLE connected_influencers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    project_id BIGINT NOT NULL,
    channel_id VARCHAR(255) NOT NULL,
    added_by BIGINT,
    from_task_ids JSON,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY (project_id, channel_id),
    INDEX idx_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 修改现有表

```sql
-- 1. spider_record 表添加索引
CREATE INDEX project_id_IDX ON youtube.spider_record (project_id);
CREATE INDEX creator_IDX ON youtube.spider_record (creator);

-- 2. youtube_channel_rate 表添加 project_id
ALTER TABLE youtube.youtube_channel_rate 
ADD COLUMN project_id BIGINT COMMENT '项目ID';

CREATE INDEX project_id_IDX ON youtube.youtube_channel_rate (project_id);
```

---

## ✅ 总结

### 能直接用（3个）
1. 退出登录
2. 获取个人资料
3. 导出功能

### 要修改（11个）
1. 用户登录 - 简化参数
2. 项目列表 - 简化响应
3. 创建任务（关键词）- 调整参数映射
4. 创建任务（红人ID）- 合并到统一接口
5. 任务列表 - 移除 spiderType
6. 查看搜索结果 - 扩展筛选
7. 任务详情 - 调整响应格式
8. 重命名任务 - RESTful 风格
9. 标记建联 - 创建记录
10. 建联列表 - 添加来源任务
11. 移除建联 - 删除记录

### 要新增（9个）
1. 用户注册
2. 创建项目
3. 更新项目
4. 删除项目
5. 删除任务
6. 上传排除名单
7. 排除列表
8. 删除排除
9. （国家/红人类型下拉列表可复用旧接口）

---

**预估工作量**: 2-3 周（1人全职）
