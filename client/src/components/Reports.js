import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { generatePDF, generateFoodInventoryReport, generateAnimalHealthReport, generateCleaningReport, generateTicketSalesReport } from '../utils/pdfGenerator';

const Reports = () => {
  const [foods, setFoods] = useState([]);
  const [stock, setStock] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [cleaningLogs, setCleaningLogs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Cargar alimentos y stock
      const { data: foodsData, error: foodsError } = await supabase
        .from('food_items')
        .select('*');
      
      if (foodsError) throw foodsError;
      setFoods(foodsData);
      
      const { data: stockData, error: stockError } = await supabase
        .from('food_stock')
        .select('*');
      
      if (stockError) throw stockError;
      setStock(stockData);
      
      // Cargar animales (necesitamos información adicional)
      const { data: animalsData, error: animalsError } = await supabase
        .from('animals')
        .select('*');
      
      if (animalsError) throw animalsError;
      setAnimals(animalsData);
      
      // Cargar registros de limpieza
      const { data: logsData, error: logsError } = await supabase
        .from('cleaning_logs')
        .select('*')
        .order('performed_at', { ascending: false });
      
      if (logsError) throw logsError;
      setCleaningLogs(logsData);
      
      // Cargar entradas
      const { data: ticketsData, error: ticketsError } = await supabase
        .from('tickets')
        .select('*')
        .order('purchased_at', { ascending: false });
      
      if (ticketsError) throw ticketsError;
      setTickets(ticketsData);
      
      // Cargar tipos de entrada
      const { data: typesData, error: typesError } = await supabase
        .from('ticket_types')
        .select('*');
      
      if (typesError) throw typesError;
      setTicketTypes(typesData);
      
    } catch (err) {
      setError('Error al cargar datos para reportes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para generar reporte de inventario de alimentos
  const handleGenerateFoodInventoryReport = async () => {
    try {
      // Generar contenido HTML para el reporte
      const reportContent = generateFoodInventoryReport(foods, stock);
      
      // Crear un elemento temporal para el reporte
      const reportElement = document.createElement('div');
      reportElement.id = 'food-inventory-report-content';
      reportElement.innerHTML = reportContent;
      
      // Agregar el elemento al DOM temporalmente
      document.body.appendChild(reportElement);
      
      // Generar PDF
      await generatePDF('food-inventory-report-content', 'inventario_alimentos.pdf');
      
      // Remover el elemento temporal
      document.body.removeChild(reportElement);
    } catch (err) {
      setError('Error al generar reporte: ' + err.message);
    }
  };

  // Función para generar reporte de estado de salud de animales
  const handleGenerateAnimalHealthReport = async () => {
    try {
      // Generar contenido HTML para el reporte
      const reportContent = generateAnimalHealthReport(animals);
      
      // Crear un elemento temporal para el reporte
      const reportElement = document.createElement('div');
      reportElement.id = 'animal-health-report-content';
      reportElement.innerHTML = reportContent;
      
      // Agregar el elemento al DOM temporalmente
      document.body.appendChild(reportElement);
      
      // Generar PDF
      await generatePDF('animal-health-report-content', 'estado_salud_animales.pdf');
      
      // Remover el elemento temporal
      document.body.removeChild(reportElement);
    } catch (err) {
      setError('Error al generar reporte: ' + err.message);
    }
  };

  // Función para generar reporte de limpieza del día
  const handleGenerateCleaningReport = async () => {
    try {
      // Generar contenido HTML para el reporte
      const reportContent = generateCleaningReport(cleaningLogs, []); // Pasamos tareas vacías porque no tenemos acceso directo a ellas desde este componente
      
      // Crear un elemento temporal para el reporte
      const reportElement = document.createElement('div');
      reportElement.id = 'cleaning-report-content';
      reportElement.innerHTML = reportContent;
      
      // Agregar el elemento al DOM temporalmente
      document.body.appendChild(reportElement);
      
      // Generar PDF
      await generatePDF('cleaning-report-content', 'registro_limpieza_dia.pdf');
      
      // Remover el elemento temporal
      document.body.removeChild(reportElement);
    } catch (err) {
      setError('Error al generar reporte: ' + err.message);
    }
  };

  // Función para generar reporte de ventas de entradas
  const handleGenerateTicketSalesReport = async () => {
    try {
      // Generar contenido HTML para el reporte
      const reportContent = generateTicketSalesReport(tickets, ticketTypes);
      
      // Crear un elemento temporal para el reporte
      const reportElement = document.createElement('div');
      reportElement.id = 'ticket-sales-report-content';
      reportElement.innerHTML = reportContent;
      
      // Agregar el elemento al DOM temporalmente
      document.body.appendChild(reportElement);
      
      // Generar PDF
      await generatePDF('ticket-sales-report-content', 'ventas_entradas.pdf');
      
      // Remover el elemento temporal
      document.body.removeChild(reportElement);
    } catch (err) {
      setError('Error al generar reporte: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6">Generación de Reportes</h2>
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Generación de Reportes</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Reporte de Inventario de Alimentos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Inventario de Alimentos</h3>
          <p className="text-gray-600 mb-4">Lista de alimentos y sus cantidades disponibles</p>
          <button
            onClick={handleGenerateFoodInventoryReport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Generar PDF
          </button>
        </div>
        
        {/* Reporte de Estado de Salud de Animales */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Estado de Salud de Animales</h3>
          <p className="text-gray-600 mb-4">Información sobre el estado de salud de los animales</p>
          <button
            onClick={handleGenerateAnimalHealthReport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Generar PDF
          </button>
        </div>
        
        {/* Reporte de Limpieza del Día */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Registro de Limpieza del Día</h3>
          <p className="text-gray-600 mb-4">Registros de ejecución de tareas de limpieza</p>
          <button
            onClick={handleGenerateCleaningReport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Generar PDF
          </button>
        </div>
        
        {/* Reporte de Ventas de Entradas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Ventas de Entradas</h3>
          <p className="text-gray-600 mb-4">Resumen de ventas de entradas</p>
          <button
            onClick={handleGenerateTicketSalesReport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            Generar PDF
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Acciones Rápidas</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={fetchData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Recargar Datos
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;