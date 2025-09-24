import React from 'react';
import Navigation from '../components/Navigation';

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
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Funcionalidades Disponibles</h3>
          <p className="text-gray-600">Este es un sistema de gestión completo para el zoológico Mirada Salvaje.</p>
          <p className="text-gray-600 mt-2">Las funcionalidades principales incluyen:</p>
          <ul className="list-disc list-inside mt-2 text-gray-600">
            <li>Gestión de limpieza</li>
            <li>Gestión de alimentación</li>
            <li>Control clínico</li>
            <li>Gestión de entradas</li>
            <li>Generación de reportes</li>
          </ul>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>Zoológico Mirada Salvaje &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Home;