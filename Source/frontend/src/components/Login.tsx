import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const VALID_EMAIL = 'm2406993@edu.misis';
  const VALID_PASSWORD = '12345678';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem('user', JSON.stringify({ 
        name: 'Администратор',
        email: email,
        role: 'admin' 
      }));
      navigate('/tools');
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="login-container">
      <h2>🔧 Система учёта инструментов</h2>
      <p>Вход в админ-панель</p>
      
      {error && (
        <div className="error-message" style={{
          backgroundColor: '#fee',
          color: '#c00',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #c00'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="m2406993@edu.misis"
            required
            style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
          />
        </div>

        <div className="form-group">
          <label>Пароль:</label>
          <input 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{ width: '100%', padding: '10px', marginBottom: '15px' }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%' }}>
          Войти
        </button>
      </form>

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Тестовые данные:</p>
        <p>Email: m2406993@edu.misis</p>
        <p>Пароль: 12345678</p>
      </div>
    </div>
  );
}

export default Login;