import React from 'react';
import Navigation from '../components/Navigation';
import CleaningManagement from '../components/CleaningManagement';
import FeedingManagement from '../components/FeedingManagement';
import ClinicalManagement from '../components/ClinicalManagement';
import TicketManagement from '../components/TicketManagement';
import Reports from '../components/Reports';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Bienvenido al Zoológico Mirada Salvaje</h2>
          <p className="text-gray-700">
            Sistema de gestión integral para el zoológico. Accede a las diferentes funcionalidades según tu rol.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-green-700 mb-2">Limpieza</h3>
            <p className="text-gray-600">Gestiona tareas de limpieza y registros de ejecución.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-green-700 mb-2">Alimentación</h3>
            <p className="text-gray-600">Administra inventario y horarios de alimentación.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-green-700 mb-2">Control Clínico</h3>
            <p className="text-gray-600">Registro de visitas veterinarias y tratamientos.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-green-700 mb-2">Entradas</h3>
            <p className="text-gray-600">Gestiona tipos de entrada y promociones.</p>
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Gestión de Limpieza</h3>
          <CleaningManagement />
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Gestión de Alimentación</h3>
          <FeedingManagement />
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Control Clínico</h3>
          <ClinicalManagement />
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Entradas y Promociones</h3>
          <TicketManagement />
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Reportes</h3>
          <Reports />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>Zoológico Mirada Salvaje &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Home;