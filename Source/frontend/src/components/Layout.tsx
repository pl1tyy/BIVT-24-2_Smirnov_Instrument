import { useNavigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="container">
      {/* Шапка с навигацией */}
      <header className="header">
        <div className="header-left">
          <h1>Учёт инструментов</h1>
          <nav className="nav">
            <button 
              onClick={() => navigate('/tools')}
              className={`nav-btn ${location.pathname === '/tools' ? 'active' : ''}`}
            >
              🔧 Инструменты
            </button>
            <button 
              onClick={() => navigate('/users')}
              className={`nav-btn ${location.pathname === '/users' ? 'active' : ''}`}
            >
              👥 Пользователи
            </button>
          </nav>
        </div>
        <div className="header-right">
          <span className="user-info">👤 {user.name || 'Пользователь'} ({user.role || 'viewer'})</span>
          <button onClick={handleLogout} className="btn-logout">Выход</button>
        </div>
      </header>

      {/* Основной контент страницы */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;