import React from 'react';
import { useAuth } from '../context/AuthContext';
import Auth from './Auth';

const Navigation = () => {
  const { session } = useAuth();

  return (
    <nav className="bg-green-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Zoológico Mirada Salvaje</h1>
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="hidden md:inline">Bienvenido, {session.user.email}</span>
              <Auth />
            </>
          ) : (
            <Auth />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;