import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Mock Data
const MOCK_INFLUENCERS = Array.from({ length: 20 }).map((_, i) => ({
  id: `inf-${i + 1}`,
  name: `红人账号 ${i + 1}`,
  handle: `@influencer_${i + 1}`,
  platform: i % 2 === 0 ? 'YouTube' : 'Instagram',
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  avgViews: Math.floor(Math.random() * 500000) + 10000,
  engagementRate: (Math.random() * 5 + 1).toFixed(2),
  qualityScore: Math.floor(Math.random() * 30) + 70,
  followers: Math.floor(Math.random() * 1000000) + 50000,
  description: "高质量内容创作者，专注于生活方式和科技领域。",
  isConnected: false,
  connectionStatus: '未建联'
}));

export const AppProvider = ({ children }) => {
  // Project Management
  const [projects, setProjects] = useState([
    {
      id: 'proj_1',
      name: 'Q1 新品推广',
      color: '#6366f1',
      description: '第一季度新品推广活动',
      createdAt: '2024-01-15'
    },
    {
      id: 'proj_2',
      name: '美妆品牌合作',
      color: '#ec4899',
      description: '美妆品牌红人合作项目',
      createdAt: '2024-01-18'
    }
  ]);

  const [currentProject, setCurrentProject] = useState(projects[0]);

  const createProject = (projectData) => {
    const newProject = {
      id: `proj_${Date.now()}`,
      ...projectData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects([...projects, newProject]);
    setCurrentProject(newProject);
    return newProject;
  };

  const switchProject = (project) => {
    setCurrentProject(project);
  };

  const [tasks, setTasks] = useState([
    {
      id: '1',
      name: "Q1 新品发布推广",
      createdAt: "2024-01-20",
      creator: "Max User",
      status: "completed",
      keywords: "科技, 数码, 测评",
      platform: "YouTube",
      searchMethod: "关键词搜索",
      results: MOCK_INFLUENCERS.slice(0, 8).map(inf => inf.id),
      details: {
        taskName: "Q1 新品发布推广",
        industryKeywords: ["科技", "数码", "测评"],
        brandKeywords: [],
        competitorKeywords: [],
        maxInfluencers: '50',
        platform: 'YouTube',
        sortBy: '相关性',
        targetRegion: '按视频',
        targetCountries: ['美国', '英国'],
        fanRangeOperator: '>=',
        fanRangeValue: '10000',
        excludeSearched: true,
        excludeDeduplicated: true,
        p0Types: [],
        p1Types: [],
        p2Types: []
      }
    },
    {
      id: '2',
      name: "美妆品牌认知度提升",
      createdAt: "2024-01-22",
      creator: "Max User",
      status: "processing",
      keywords: "美妆, 护肤, 美容",
      platform: "Instagram",
      searchMethod: "关键词搜索",
      results: [],
      details: {
        taskName: "美妆品牌认知度提升",
        industryKeywords: ["美妆", "护肤", "美容"],
        brandKeywords: [],
        competitorKeywords: [],
        maxInfluencers: '50',
        platform: 'Instagram',
        sortBy: '相关性',
        targetRegion: '按视频',
        targetCountries: ['美国'],
        fanRangeOperator: '>=',
        fanRangeValue: '50000',
        excludeSearched: true,
        excludeDeduplicated: true,
        p0Types: [],
        p1Types: [],
        p2Types: []
      }
    }
  ]);

  const [influencers, setInfluencers] = useState(MOCK_INFLUENCERS);

  // Helper to get influencers for a specific task
  const getTaskResults = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return [];
    return influencers.filter(inf => task.results.includes(inf.id));
  };

  const createTask = (newTaskData) => {
    const newTask = {
      id: String(Date.now()),
      ...newTaskData,
      createdAt: new Date().toISOString().split('T')[0],
      creator: "Max User",
      status: 'processing',
      results: [] // In a real app, this would be populated by backend
    };

    setTasks([newTask, ...tasks]);

    // Simulate backend processing
    setTimeout(() => {
      setTasks(prev => prev.map(t =>
        t.id === newTask.id
          ? { ...t, status: 'completed', results: MOCK_INFLUENCERS.slice(8, 15).map(i => i.id) }
          : t
      ));
    }, 3000);
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const renameTask = (taskId, newName) => {
    setTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, name: newName } : t
    ));
  };

  const toggleConnection = (influencerId) => {
    setInfluencers(prev => prev.map(inf => {
      if (inf.id === influencerId) {
        return {
          ...inf,
          isConnected: !inf.isConnected,
          connectionStatus: !inf.isConnected ? '未建联' : '未建联' // Logic: If unmarking, reset. If marking, it enters "Not Connected" list.
        };
      }
      return inf;
    }));
  };

  const getConnectedInfluencers = () => {
    return influencers.filter(inf => inf.isConnected);
  };

  return (
    <AppContext.Provider value={{
      // Project Management
      projects,
      currentProject,
      createProject,
      switchProject,
      // Task Management
      tasks,
      createTask,
      deleteTask,
      renameTask,
      getTaskResults,
      // Influencer Management
      toggleConnection,
      getConnectedInfluencers,
      allInfluencers: influencers
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
