import { useEffect, useState } from 'react';
import apiClient from '../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', age: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/users', {
        name: newUser.name,
        email: newUser.email,
        age: newUser.age ? parseInt(newUser.age) : undefined,
      });
      setUsers(prevUsers => [...prevUsers, response.data]);
      setNewUser({ name: '', email: '', age: '' });
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Неизвестная ошибка';
      alert('Ошибка: ' + (Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg));
    }
  };

  return (
    <div>
      <h2>Управление пользователями</h2>

      <form onSubmit={handleSubmit} className="form">
        <input 
          placeholder="Имя" 
          value={newUser.name} 
          onChange={e => setNewUser({...newUser, name: e.target.value})} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={newUser.email} 
          onChange={e => setNewUser({...newUser, email: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="Возраст" 
          value={newUser.age} 
          onChange={e => setNewUser({...newUser, age: e.target.value})} 
        />
        <button type="submit" className="btn-primary">Добавить</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Возраст</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersPage;