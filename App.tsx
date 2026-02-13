
import React, { useState, useEffect } from 'react';
import ThreeBackground from './components/ThreeBackground';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  // Persistence check
  useEffect(() => {
    const saved = localStorage.getItem('tps_current_user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('tps_current_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('tps_current_user');
  };

  return (
    <div className="min-h-screen text-white">
      <ThreeBackground />
      <Navbar user={user} onLogout={handleLogout} />
      
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} />
      )}

      {/* Footer Branding */}
      <footer className="fixed bottom-6 left-6 opacity-30 pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Ashraf Morningstar x Gemini</p>
      </footer>
    </div>
  );
};

export default App;
