import React from 'react';
import './App.css';
import SinglePageApp from './pages/SinglePageApp';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <SinglePageApp />
      </AuthProvider>
    </div>
  );
}

export default App;