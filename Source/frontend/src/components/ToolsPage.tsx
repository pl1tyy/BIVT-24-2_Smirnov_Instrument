import { useEffect, useState } from 'react';
import apiClient from '../api/axios';
import { useNavigate } from 'react-router-dom';

interface Tool {
  id: number;
  inventory_number: string;
  name: string;
  category_id?: number;
  status: string;
  purchase_date?: string;
  condition_score?: number;
}

interface Category {
  id: number;
  name: string;
}

function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newTool, setNewTool] = useState({
    inventory_number: '',
    name: '',
    category_id: '',
    status: 'available',
    purchase_date: '',
    condition_score: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTools();
    fetchCategories();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await apiClient.get('/tools');
      setTools(response.data);
    } catch (error) {
      console.error('Ошибка загрузки инструментов:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post('/tools', {
        ...newTool,
        category_id: newTool.category_id ? parseInt(newTool.category_id) : undefined,
        condition_score: newTool.condition_score ? parseInt(newTool.condition_score) : undefined,
      });
      setNewTool({
        inventory_number: '',
        name: '',
        category_id: '',
        status: 'available',
        purchase_date: '',
        condition_score: '',
      });
      fetchTools();
    } catch (error: any) {
      alert('Ошибка: ' + JSON.stringify(error.response?.data));
    }
  };

  const getStatusText = (status: string) => {
    const statuses: Record<string, string> = {
      available: 'Доступен',
      issued: 'Выдан',
      maintenance: 'На обслуживании',
      written_off: 'Списан',
    };
    return statuses[status] || status;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Учёт инструментов</h1>
        <div>
          <button onClick={() => navigate('/users')} style={{ marginRight: '10px' }}>Пользователи</button>
          <button onClick={handleLogout}>Выход</button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="form">
        <input 
          placeholder="Инвентарный номер" 
          value={newTool.inventory_number} 
          onChange={e => setNewTool({...newTool, inventory_number: e.target.value})} 
          required 
        />
        <input 
          placeholder="Название" 
          value={newTool.name} 
          onChange={e => setNewTool({...newTool, name: e.target.value})} 
          required 
        />
        <select 
          value={newTool.category_id} 
          onChange={e => setNewTool({...newTool, category_id: e.target.value})}
        >
          <option value="">Категория</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input 
          type="date"
          placeholder="Дата покупки" 
          value={newTool.purchase_date} 
          onChange={e => setNewTool({...newTool, purchase_date: e.target.value})} 
        />
        <input 
          type="number"
          min="1"
          max="5"
          placeholder="Состояние (1-5)" 
          value={newTool.condition_score} 
          onChange={e => setNewTool({...newTool, condition_score: e.target.value})} 
        />
        <button type="submit" className="btn-primary">Добавить</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Инв. номер</th>
            <th>Название</th>
            <th>Категория</th>
            <th>Статус</th>
            <th>Дата покупки</th>
            <th>Состояние</th>
          </tr>
        </thead>
        <tbody>
          {tools.map(tool => (
            <tr key={tool.id}>
              <td>{tool.id}</td>
              <td>{tool.inventory_number}</td>
              <td>{tool.name}</td>
              <td>{categories.find(c => c.id === tool.category_id)?.name || '-'}</td>
              <td>{getStatusText(tool.status)}</td>
              <td>{tool.purchase_date || '-'}</td>
              <td>{tool.condition_score || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ToolsPage;