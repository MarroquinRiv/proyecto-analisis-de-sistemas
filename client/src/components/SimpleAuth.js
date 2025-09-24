import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const SimpleAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Verificar sesión existente
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
      }
    };

    checkSession();

    // Escuchar cambios en la autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
    });

    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Registro exitoso. Revisa tu correo para confirmar.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setSession(null);
    }
  };

  if (session) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
        <span className="text-sm text-gray-700 hidden md:inline">Bienvenido, {session.user.email}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-3 text-center">{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
      
      {message.text && (
        <div className={`mb-3 p-2 rounded text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded text-sm transition-colors disabled:opacity-50"
        >
          {loading ? 'Procesando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
        </button>
      </form>
      
      <div className="mt-3 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-green-600 hover:text-green-700 text-sm"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
};

export default SimpleAuth;