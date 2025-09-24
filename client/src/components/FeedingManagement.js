import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const FeedingManagement = () => {
  const [foods, setFoods] = useState([]);
  const [stock, setStock] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Formularios
  const [newFood, setNewFood] = useState({
    name: '',
    unit: ''
  });
  
  const [newStock, setNewStock] = useState({
    food_item_id: '',
    quantity: ''
  });
  
  const [newSchedule, setNewSchedule] = useState({
    animal_id: '',
    feeding_time: ''
  });
  
  const [newLog, setNewLog] = useState({
    feeding_schedule_id: '',
    fed_by: ''
  });
  
  // Cargar datos iniciales
  useEffect(() => {
    fetchFoods();
    fetchStock();
    fetchSchedules();
    fetchLogs();
  }, []);
  
  const fetchFoods = async () => {
    try {
      const { data, error } = await supabase
        .from('food_items')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setFoods(data);
    } catch (err) {
      setError('Error al cargar alimentos: ' + err.message);
    }
  };
  
  const fetchStock = async () => {
    try {
      const { data, error } = await supabase
        .from('food_stock')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setStock(data);
    } catch (err) {
      setError('Error al cargar stock: ' + err.message);
    }
  };
  
  const fetchSchedules = async () => {
    try {
      const { data, error } = await supabase
        .from('feeding_schedules')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setSchedules(data);
    } catch (err) {
      setError('Error al cargar horarios: ' + err.message);
    }
  };
  
  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('feeding_logs')
        .select('*')
        .order('fed_at', { ascending: false });
      
      if (error) throw error;
      setLogs(data);
    } catch (err) {
      setError('Error al cargar registros: ' + err.message);
    }
  };
  
  const handleCreateFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('food_items')
        .insert([newFood])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de alimentos
      setFoods([...foods, data[0]]);
      setNewFood({ name: '', unit: '' });
    } catch (err) {
      setError('Error al crear alimento: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateStock = async (id, quantity) => {
    try {
      const { data, error } = await supabase
        .from('food_stock')
        .update({ quantity })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de stock
      setStock(stock.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    } catch (err) {
      setError('Error al actualizar stock: ' + err.message);
    }
  };
  
  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('feeding_schedules')
        .insert([newSchedule])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de horarios
      setSchedules([...schedules, data[0]]);
      setNewSchedule({ animal_id: '', feeding_time: '' });
    } catch (err) {
      setError('Error al crear horario: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('feeding_logs')
        .insert([newLog])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de registros
      setLogs([data[0], ...logs]);
      setNewLog({ feeding_schedule_id: '', fed_by: '' });
    } catch (err) {
      setError('Error al registrar alimentación: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Gestión de Alimentación</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Alimentos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Alimentos</h3>
          
          <form onSubmit={handleCreateFood} className="mb-6">
            <h4 className="font-medium mb-2">Agregar Nuevo Alimento</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  value={newFood.name}
                  onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Unidad</label>
                <input
                  type="text"
                  value={newFood.unit}
                  onChange={(e) => setNewFood({...newFood, unit: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Crear Alimento'}
              </button>
            </div>
          </form>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unidad</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {foods.map(food => (
                  <tr key={food.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{food.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{food.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Sección de Stock */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Stock de Alimentos</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alimento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stock.map(item => {
                  const food = foods.find(f => f.id === item.food_item_id);
                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{food ? food.name : 'Alimento no encontrado'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateStock(item.id, parseFloat(e.target.value))}
                          className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Sección de Horarios */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Horarios de Alimentación</h3>
          
          <form onSubmit={handleCreateSchedule} className="mb-6">
            <h4 className="font-medium mb-2">Crear Nuevo Horario</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Animal</label>
                <input
                  type="text"
                  placeholder="ID del animal"
                  value={newSchedule.animal_id}
                  onChange={(e) => setNewSchedule({...newSchedule, animal_id: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Hora</label>
                <input
                  type="time"
                  value={newSchedule.feeding_time}
                  onChange={(e) => setNewSchedule({...newSchedule, feeding_time: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Crear Horario'}
              </button>
            </div>
          </form>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hora</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedules.map(schedule => (
                  <tr key={schedule.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{schedule.animal_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{schedule.feeding_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Sección de Registros */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Registros de Alimentación</h3>
          
          <form onSubmit={handleCreateLog} className="mb-6">
            <h4 className="font-medium mb-2">Registrar Alimentación</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Horario</label>
                <select
                  value={newLog.feeding_schedule_id}
                  onChange={(e) => setNewLog({...newLog, feeding_schedule_id: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar horario</option>
                  {schedules.map(schedule => (
                    <option key={schedule.id} value={schedule.id}>Animal {schedule.animal_id} - {schedule.feeding_time}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Alimentado por</label>
                <input
                  type="text"
                  value={newLog.fed_by}
                  onChange={(e) => setNewLog({...newLog, fed_by: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Registrar Alimentación'}
              </button>
            </div>
          </form>
          
          <div className="space-y-4">
            {logs.slice(0, 10).map(log => {
              const schedule = schedules.find(s => s.id === log.feeding_schedule_id);
              return (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <h4 className="font-medium">Alimentación del animal {schedule ? schedule.animal_id : 'desconocido'}</h4>
                    <span className="text-sm text-gray-500">{new Date(log.fed_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">Alimentado por: {log.fed_by}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedingManagement;