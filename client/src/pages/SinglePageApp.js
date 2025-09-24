import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import SimpleAuth from '../components/SimpleAuth';
import { generatePDF, generateFoodInventoryReport, generateAnimalHealthReport, generateCleaningReport, generateTicketSalesReport } from '../utils/reportGenerator';

const SinglePageApp = () => {
  const [session, setSession] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [activeSection, setActiveSection] = useState('limpieza');
  
  // Estados para cada sección
  const [areas, setAreas] = useState([]);
  const [cleaningTasks, setCleaningTasks] = useState([]);
  const [cleaningLogs, setCleaningLogs] = useState([]);
  const [foods, setFoods] = useState([]);
  const [foodStock, setFoodStock] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [clinicalVisits, setClinicalVisits] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [tickets, setTickets] = useState([]);
  
  // Estados para formularios
  const [newCleaningLog, setNewCleaningLog] = useState({
    task_id: '',
    performed_by: '',
    notes: ''
  });
  
  const [newFeedingLog, setNewFeedingLog] = useState({
    feeding_schedule_id: '',
    fed_by: ''
  });
  
  const [newClinicalVisit, setNewClinicalVisit] = useState({
    animal_id: '',
    vet_id: '',
    visit_date: ''
  });
  
  const [newTicketPurchase, setNewTicketPurchase] = useState({
    ticket_type_id: '',
    promotion_id: '',
    visit_date: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setSession(session);
          await loadUserData(session.user.id);
        } else {
          setSession(null);
        }
      } catch (err) {
        setError('Error al verificar sesión: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setSession(session);
        loadUserData(session.user.id);
      } else {
        setSession(null);
        setUserProfile(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUserData = async (userId) => {
    try {
      // Cargar perfil del usuario
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_id', userId)
        .single();
      
      if (profileError) throw profileError;
      setUserProfile(profileData);
      
      // Cargar datos según el rol
      await loadDataBasedOnRole(profileData.role);
    } catch (err) {
      setError('Error al cargar datos del usuario: ' + err.message);
    }
  };

  const loadDataBasedOnRole = async (role) => {
    try {
      // Cargar áreas
      const { data: areasData, error: areasError } = await supabase
        .from('zoo.areas')
        .select('*');
      
      if (areasError) throw areasError;
      setAreas(areasData);
      
      // Cargar tareas de limpieza
      const { data: tasksData, error: tasksError } = await supabase
        .from('zoo.cleaning_tasks')
        .select('*')
        .order('id', { ascending: true });
      
      if (tasksError) throw tasksError;
      setCleaningTasks(tasksData);
      
      // Cargar registros de limpieza
      const { data: logsData, error: logsError } = await supabase
        .from('zoo.cleaning_logs')
        .select('*')
        .order('performed_at', { ascending: false });
      
      if (logsError) throw logsError;
      setCleaningLogs(logsData);
      
      // Cargar alimentos y stock
      const { data: foodsData, error: foodsError } = await supabase
        .from('zoo.food_items')
        .select('*')
        .order('id', { ascending: true });
      
      if (foodsError) throw foodsError;
      setFoods(foodsData);
      
      const { data: stockData, error: stockError } = await supabase
        .from('zoo.food_stock')
        .select('*')
        .order('id', { ascending: true });
      
      if (stockError) throw stockError;
      setFoodStock(stockData);
      
      // Cargar animales
      const { data: animalsData, error: animalsError } = await supabase
        .from('zoo.animals')
        .select('*');
      
      if (animalsError) throw animalsError;
      setAnimals(animalsData);
      
      // Cargar visitas clínicas
      const { data: visitsData, error: visitsError } = await supabase
        .from('zoo.clinical_visits')
        .select('*')
        .order('visit_date', { ascending: false });
      
      if (visitsError) throw visitsError;
      setClinicalVisits(visitsData);
      
      // Cargar tipos de entradas (solo para roles que pueden verlos)
      if (role === 'visitor' || role === 'staff' || role === 'admin') {
        const { data: ticketTypesData, error: ticketTypesError } = await supabase
          .from('zoo.ticket_types')
          .select('*')
          .order('id', { ascending: true });
        
        if (ticketTypesError) throw ticketTypesError;
        setTicketTypes(ticketTypesData);
      }
      
      // Cargar promociones (solo para roles que pueden verlas)
      if (role === 'visitor' || role === 'staff' || role === 'admin') {
        const { data: promotionsData, error: promotionsError } = await supabase
          .from('zoo.promotions')
          .select('*')
          .eq('active', true)
          .order('id', { ascending: true });
        
        if (promotionsError) throw promotionsError;
        setPromotions(promotionsData);
      }
      
    } catch (err) {
      setError('Error al cargar datos: ' + err.message);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setError('Error al cerrar sesión: ' + error.message);
    } else {
      setSession(null);
      setUserProfile(null);
    }
  };

  const handleCreateCleaningLog = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('zoo.cleaning_logs')
        .insert([newCleaningLog])
        .select();
      
      if (error) throw error;
      
      setCleaningLogs([data[0], ...cleaningLogs]);
      setNewCleaningLog({ task_id: '', performed_by: '', notes: '' });
    } catch (err) {
      setError('Error al registrar limpieza: ' + err.message);
    }
  };

  const handleCreateFeedingLog = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('zoo.feeding_logs')
        .insert([newFeedingLog])
        .select();
      
      if (error) throw error;
      
      // Aquí podrías actualizar la lista de registros de alimentación si es necesario
      setNewFeedingLog({ feeding_schedule_id: '', fed_by: '' });
    } catch (err) {
      setError('Error al registrar alimentación: ' + err.message);
    }
  };

  const handleCreateClinicalVisit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('zoo.clinical_visits')
        .insert([newClinicalVisit])
        .select();
      
      if (error) throw error;
      
      setClinicalVisits([data[0], ...clinicalVisits]);
      setNewClinicalVisit({ animal_id: '', vet_id: '', visit_date: '' });
    } catch (err) {
      setError('Error al registrar visita clínica: ' + err.message);
    }
  };

  const handleBuyTicket = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('zoo.tickets')
        .insert([{
          ticket_type_id: newTicketPurchase.ticket_type_id,
          promotion_id: newTicketPurchase.promotion_id || null,
          purchaser_profile_id: userProfile?.id || null,
          purchased_at: new Date(),
          visit_date: newTicketPurchase.visit_date,
          price_paid: 0 // En una implementación real se calcularía el precio
        }])
        .select();
      
      if (error) throw error;
      
      setTickets([data[0], ...tickets]);
      setNewTicketPurchase({ ticket_type_id: '', promotion_id: '', visit_date: '' });
    } catch (err) {
      setError('Error al comprar entrada: ' + err.message);
    }
  };

  // Función para generar reporte PDF
  const generateReport = async (reportType) => {
    try {
      // Mostrar mensaje de carga
      alert(`Generando reporte ${reportType}...`);
      
      // Generar el contenido según el tipo de reporte
      let reportContent = '';
      
      switch(reportType) {
        case 'inventario':
          reportContent = generateFoodInventoryReport(foods, foodStock);
          break;
        case 'salud':
          reportContent = generateAnimalHealthReport(animals);
          break;
        case 'limpieza':
          reportContent = generateCleaningReport(cleaningLogs, cleaningTasks);
          break;
        case 'ventas':
          reportContent = generateTicketSalesReport(tickets, ticketTypes);
          break;
        default:
          throw new Error('Tipo de reporte no válido');
      }
      
      // Crear un elemento temporal para el reporte
      const reportElement = document.createElement('div');
      reportElement.id = `${reportType}-report-content`;
      reportElement.innerHTML = reportContent;
      
      // Agregar el elemento al DOM temporalmente
      document.body.appendChild(reportElement);
      
      // Generar PDF
      await generatePDF(`${reportType}-report-content`, `reporte_${reportType}.pdf`);
      
      // Remover el elemento temporal
      document.body.removeChild(reportElement);
      
    } catch (err) {
      setError('Error al generar reporte: ' + err.message);
      console.error('Error al generar reporte:', err);
    }
  };

  // Renderizar sección según rol
  const renderSection = (sectionName, role, title, icon, content) => {
    // Solo mostrar secciones según el rol del usuario
    if (role === 'admin' || role === 'staff' || 
        (role === 'visitor' && sectionName === 'entradas')) {
      return (
        <div className="mb-8" id={sectionName}>
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">{icon}</span>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          </div>
          {content}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-700 mb-2">Zoológico Mirada Salvaje</h1>
            <p className="text-gray-600">Sistema de gestión integral</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cuentas de prueba</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Administrador:</span>
                <span className="text-green-600">admin@miradasalvaje.com / Admin123!</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Personal:</span>
                <span className="text-green-600">staff@miradasalvaje.com / Staff123!</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Visitante:</span>
                <span className="text-green-600">visitor@miradasalvaje.com / Visitor123!</span>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Nota:</strong> Inicia sesión con una de las cuentas de prueba para acceder al sistema.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">¿Qué puedes hacer?</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Administradores: Acceso completo a todas las funcionalidades</li>
              <li>• Personal: Gestión de limpieza, alimentación y clínica</li>
              <li>• Visitantes: Compra de entradas y promociones</li>
            </ul>
          </div>
          
          <div className="mt-6">
            <SimpleAuth />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con información del usuario */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-700">Zoológico Mirada Salvaje</h1>
            <p className="text-sm text-gray-600">
              Bienvenido, {userProfile?.name || session.user.email} ({userProfile?.role || 'Sin rol'})
            </p>
          </div>
          
          <SimpleAuth />
        </div>
      </header>

      {/* Contenido principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Sección de navegación rápida */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Navegación Rápida</h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => document.getElementById('limpieza').scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Limpieza
            </button>
            <button 
              onClick={() => document.getElementById('alimentacion').scrollIntoView({ behavior: 'smooth' })}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Alimentación
            </button>
            <button 
              onClick={() => document.getElementById('clinica').scrollIntoView({ behavior: 'smooth' })}
              className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Clínica
            </button>
            <button 
              onClick={() => document.getElementById('entradas').scrollIntoView({ behavior: 'smooth' })}
              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Entradas
            </button>
            <button 
              onClick={() => document.getElementById('reportes').scrollIntoView({ behavior: 'smooth' })}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Reportes
            </button>
          </div>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Sección de Limpieza */}
        {renderSection('limpieza', userProfile?.role, '🧼 Gestión de Limpieza', '🧹', (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lista de tareas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tareas Pendientes</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {cleaningTasks.length > 0 ? (
                    cleaningTasks.map(task => {
                      const area = areas.find(a => a.id === task.area_id);
                      return (
                        <div key={task.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{task.description}</h4>
                              <p className="text-sm text-gray-600">Área: {area?.name || 'Desconocida'}</p>
                              <p className="text-sm text-gray-600">Frecuencia: {task.frequency}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 italic">No hay tareas pendientes</p>
                  )}
                </div>
              </div>

              {/* Formulario de registro */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar Limpieza Realizada</h3>
                <form onSubmit={handleCreateCleaningLog} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tarea</label>
                    <select
                      value={newCleaningLog.task_id}
                      onChange={(e) => setNewCleaningLog({...newCleaningLog, task_id: parseInt(e.target.value)})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      required
                    >
                      <option value="">Seleccionar tarea</option>
                      {cleaningTasks.map(task => {
                        const area = areas.find(a => a.id === task.area_id);
                        return (
                          <option key={task.id} value={task.id}>
                            {task.description} - {area?.name || 'Desconocida'}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Realizado por</label>
                    <input
                      type="text"
                      value={newCleaningLog.performed_by}
                      onChange={(e) => setNewCleaningLog({...newCleaningLog, performed_by: e.target.value})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="Nombre del personal"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
                    <textarea
                      value={newCleaningLog.notes}
                      onChange={(e) => setNewCleaningLog({...newCleaningLog, notes: e.target.value})}
                      rows="3"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      placeholder="Detalles de la limpieza..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Registrar Limpieza
                  </button>
                </form>
              </div>
            </div>

            {/* Últimos registros */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Últimos Registros</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cleaningLogs.slice(0, 3).map(log => {
                  const task = cleaningTasks.find(t => t.id === log.task_id);
                  return (
                    <div key={log.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">{task?.description || 'Tarea desconocida'}</h4>
                        <span className="text-xs text-gray-500">{new Date(log.performed_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-gray-600">Realizado por: {log.performed_by}</p>
                      {log.notes && <p className="text-xs text-gray-500 mt-1">Notas: {log.notes}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Sección de Alimentación */}
        {renderSection('alimentacion', userProfile?.role, '🥩 Gestión de Alimentación', '🍖', (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inventario de alimentos */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Inventario de Alimentos</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {foodStock.length > 0 ? (
                    foodStock.map(stock => {
                      const food = foods.find(f => f.id === stock.food_item_id);
                      return (
                        <div key={stock.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">{food?.name || 'Desconocido'}</h4>
                              <p className="text-sm text-gray-600">Unidad: {food?.unit || 'N/A'}</p>
                              <p className="text-sm text-gray-600">Cantidad: {stock.quantity}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-500 italic">No hay alimentos registrados</p>
                  )}
                </div>
              </div>

              {/* Formulario de alimentación */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar Alimentación</h3>
                <form onSubmit={handleCreateFeedingLog} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Horario de Alimentación</label>
                    <select
                      value={newFeedingLog.feeding_schedule_id}
                      onChange={(e) => setNewFeedingLog({...newFeedingLog, feeding_schedule_id: parseInt(e.target.value)})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    >
                      <option value="">Seleccionar horario</option>
                      {/* Aquí irían los horarios de alimentación cargados dinámicamente */}
                      {/*
                      <option value="1">Animal 1 - 08:00 AM</option>
                      <option value="2">Animal 2 - 12:00 PM</option>
                      <option value="3">Animal 3 - 05:00 PM</option>
                      */}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alimentado por</label>
                    <input
                      type="text"
                      value={newFeedingLog.fed_by}
                      onChange={(e) => setNewFeedingLog({...newFeedingLog, fed_by: e.target.value})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Nombre del personal"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Registrar Alimentación
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {/* Sección de Control Clínico */}
        {renderSection('clinica', userProfile?.role, '🩺 Control Clínico', '🏥', (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Lista de animales */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Animales</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {animals.length > 0 ? (
                    animals.map(animal => (
                      <div key={animal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{animal.name || 'Animal sin nombre'}</h4>
                            <p className="text-sm text-gray-600">Tag: {animal.tag_code || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Estado: {animal.status || 'Desconocido'}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No hay animales registrados</p>
                  )}
                </div>
              </div>

              {/* Formulario de visita clínica */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Registrar Visita Clínica</h3>
                <form onSubmit={handleCreateClinicalVisit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Animal</label>
                    <select
                      value={newClinicalVisit.animal_id}
                      onChange={(e) => setNewClinicalVisit({...newClinicalVisit, animal_id: parseInt(e.target.value)})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      required
                    >
                      <option value="">Seleccionar animal</option>
                      {animals.map(animal => (
                        <option key={animal.id} value={animal.id}>
                          {animal.name || 'Animal sin nombre'} (Tag: {animal.tag_code || 'N/A'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID del Veterinario</label>
                    <input
                      type="number"
                      value={newClinicalVisit.vet_id}
                      onChange={(e) => setNewClinicalVisit({...newClinicalVisit, vet_id: parseInt(e.target.value)})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      placeholder="ID del veterinario"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Visita</label>
                    <input
                      type="date"
                      value={newClinicalVisit.visit_date}
                      onChange={(e) => setNewClinicalVisit({...newClinicalVisit, visit_date: e.target.value})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Registrar Visita
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {/* Sección de Entradas y Promociones */}
        {renderSection('entradas', userProfile?.role, '🎫 Entradas y Promociones', '🎟️', (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Promociones activas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Promociones Activas</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {promotions.length > 0 ? (
                    promotions.map(promo => (
                      <div key={promo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-gray-900">{promo.code}</h4>
                            <p className="text-sm text-gray-600">Descuento: {promo.discount_percent}%</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No hay promociones activas</p>
                  )}
                </div>
              </div>

              {/* Compra de entradas */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Compra de Entradas</h3>
                <form onSubmit={handleBuyTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Entrada</label>
                    <select
                      value={newTicketPurchase.ticket_type_id}
                      onChange={(e) => setNewTicketPurchase({...newTicketPurchase, ticket_type_id: parseInt(e.target.value)})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      required
                    >
                      <option value="">Seleccionar tipo</option>
                      {ticketTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name} - ${type.price}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Promoción (opcional)</label>
                    <select
                      value={newTicketPurchase.promotion_id}
                      onChange={(e) => setNewTicketPurchase({...newTicketPurchase, promotion_id: parseInt(e.target.value) || null})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                    >
                      <option value="">Sin promoción</option>
                      {promotions.map(promo => (
                        <option key={promo.id} value={promo.id}>
                          {promo.code} ({promo.discount_percent}%)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Visita</label>
                    <input
                      type="date"
                      value={newTicketPurchase.visit_date}
                      onChange={(e) => setNewTicketPurchase({...newTicketPurchase, visit_date: e.target.value})}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Comprar Entrada
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {/* Sección de Reportes */}
        {renderSection('reportes', userProfile?.role, '📊 Reportes', '📊', (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Generar Reportes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => generateReport('inventario')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-2xl mb-2">📦</div>
                <div className="font-medium">Inventario</div>
                <div className="text-sm">Alimentos</div>
              </button>
              
              <button
                onClick={() => generateReport('salud')}
                className="bg-green-100 hover:bg-green-200 text-green-700 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-2xl mb-2">🏥</div>
                <div className="font-medium">Salud Animal</div>
                <div className="text-sm">Estado</div>
              </button>
              
              <button
                onClick={() => generateReport('limpieza')}
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-2xl mb-2">🧹</div>
                <div className="font-medium">Limpieza Hoy</div>
                <div className="text-sm">Registros</div>
              </button>
              
              <button
                onClick={() => generateReport('ventas')}
                className="bg-purple-100 hover:bg-purple-200 text-purple-700 p-4 rounded-lg text-center transition-colors"
              >
                <div className="text-2xl mb-2">🎫</div>
                <div className="font-medium">Ventas</div>
                <div className="text-sm">Entradas</div>
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 mt-12">
        <div className="container mx-auto text-center">
          <p>Zoológico Mirada Salvaje &copy; {new Date().getFullYear()} - Sistema de Gestión Integral</p>
        </div>
      </footer>
    </div>
  );
};

export default SinglePageApp;