import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UsersPage from './components/UsersPage';
import ToolsPage from './components/ToolsPage';
import Layout from './components/Layout';
import './App.css';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Публичный маршрут - Вход */}
        <Route path="/" element={<Login />} />
        
        {/* Защищённые маршруты с общим Layout */}
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <Layout>
                <UsersPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tools" 
          element={
            <ProtectedRoute>
              <Layout>
                <ToolsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Перенаправление при ошибке адреса */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;