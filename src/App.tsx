import { Routes, Route } from 'react-router-dom';

import { Header } from './components/Header';
import { Home } from './pages/Home';
import { CompletedTasks } from './pages/CompletedTasks';
import { TaskProvider } from './context/TaskContext';

function App() {
  return (
    <TaskProvider>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/completed" element={<CompletedTasks />} />
        </Routes>
      </div>
    </TaskProvider>
  );
}

export default App;
