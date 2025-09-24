import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { generatePDF, generateCleaningReport } from '../utils/pdfGenerator';

const CleaningManagement = () => {
  const [areas, setAreas] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Formularios
  const [newTask, setNewTask] = useState({
    area_id: '',
    description: '',
    frequency: ''
  });
  
  const [newLog, setNewLog] = useState({
    task_id: '',
    performed_by: '',
    notes: ''
  });
  
  // Cargar datos iniciales
  useEffect(() => {
    fetchAreas();
    fetchTasks();
    fetchLogs();
  }, []);
  
  const fetchAreas = async () => {
    try {
      const { data, error } = await supabase
        .from('areas')
        .select('*');
      
      if (error) throw error;
      setAreas(data);
    } catch (err) {
      setError('Error al cargar áreas: ' + err.message);
    }
  };
  
  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('cleaning_tasks')
        .select('*')
        .order('id', { ascending: true });
      
      if (error) throw error;
      setTasks(data);
    } catch (err) {
      setError('Error al cargar tareas: ' + err.message);
    }
  };
  
  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('cleaning_logs')
        .select('*')
        .order('performed_at', { ascending: false });
      
      if (error) throw error;
      setLogs(data);
    } catch (err) {
      setError('Error al cargar registros: ' + err.message);
    }
  };
  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('cleaning_tasks')
        .insert([newTask])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de tareas
      setTasks([...tasks, data[0]]);
      setNewTask({ area_id: '', description: '', frequency: '' });
    } catch (err) {
      setError('Error al crear tarea: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteTask = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    
    try {
      const { error } = await supabase
        .from('cleaning_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Actualizar la lista de tareas
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Error al eliminar tarea: ' + err.message);
    }
  };
  
  const handleCreateLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await supabase
        .from('cleaning_logs')
        .insert([newLog])
        .select();
      
      if (error) throw error;
      
      // Actualizar la lista de registros
      setLogs([data[0], ...logs]);
      setNewLog({ task_id: '', performed_by: '', notes: '' });
    } catch (err) {
      setError('Error al registrar ejecución: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Función para generar reporte de limpieza
  const handleGenerateCleaningReport = async () => {
    try {
      // Generar contenido HTML para el reporte
      const reportContent = generateCleaningReport(logs, tasks);
      
      // Crear un elemento temporal para el reporte
      const reportElement = document.createElement('div');
      reportElement.id = 'cleaning-report-content';
      reportElement.innerHTML = reportContent;
      
      // Agregar el elemento al DOM temporalmente
      document.body.appendChild(reportElement);
      
      // Generar PDF
      await generatePDF('cleaning-report-content', 'reporte_limpieza.pdf');
      
      // Remover el elemento temporal
      document.body.removeChild(reportElement);
    } catch (err) {
      setError('Error al generar reporte: ' + err.message);
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Gestión de Limpieza</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-end mb-4">
        <button
          onClick={handleGenerateCleaningReport}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          Generar Reporte de Limpieza
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sección de Tareas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Tareas de Limpieza</h3>
          
          <form onSubmit={handleCreateTask} className="mb-6">
            <h4 className="font-medium mb-2">Crear Nueva Tarea</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Área</label>
                <select
                  value={newTask.area_id}
                  onChange={(e) => setNewTask({...newTask, area_id: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar área</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>{area.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                  type="text"
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Frecuencia</label>
                <input
                  type="text"
                  value={newTask.frequency}
                  onChange={(e) => setNewTask({...newTask, frequency: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Crear Tarea'}
              </button>
            </div>
          </form>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frecuencia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tasks.map(task => {
                  const area = areas.find(a => a.id === task.area_id);
                  return (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{area ? area.name : 'Área no encontrada'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{task.frequency}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Sección de Registros */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Registros de Ejecución</h3>
          
          <form onSubmit={handleCreateLog} className="mb-6">
            <h4 className="font-medium mb-2">Registrar Ejecución</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Tarea</label>
                <select
                  value={newLog.task_id}
                  onChange={(e) => setNewLog({...newLog, task_id: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar tarea</option>
                  {tasks.map(task => (
                    <option key={task.id} value={task.id}>{task.description}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Realizado por</label>
                <input
                  type="text"
                  value={newLog.performed_by}
                  onChange={(e) => setNewLog({...newLog, performed_by: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Notas</label>
                <textarea
                  value={newLog.notes}
                  onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Registrar Ejecución'}
              </button>
            </div>
          </form>
          
          <div className="space-y-4">
            {logs.slice(0, 10).map(log => {
              const task = tasks.find(t => t.id === log.task_id);
              return (
                <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{task ? task.description : 'Tarea no encontrada'}</h4>
                    <span className="text-sm text-gray-500">{new Date(log.performed_at).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">Realizado por: {log.performed_by}</p>
                  {log.notes && <p className="text-sm text-gray-600 mt-1">Notas: {log.notes}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleaningManagement;