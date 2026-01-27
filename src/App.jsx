import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import SearchTasks from './pages/SearchTasks';
import TaskDetails from './pages/TaskDetails';
import Connections from './pages/Connections';
import CreateTask from './pages/CreateTask';
import ExclusionList from './pages/ExclusionList';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<SearchTasks />} />
            <Route path="create-task" element={<CreateTask />} />
            <Route path="exclusions" element={<ExclusionList />} />
            <Route path="task/:taskId" element={<TaskDetails />} />
            <Route path="connect" element={<Connections />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
