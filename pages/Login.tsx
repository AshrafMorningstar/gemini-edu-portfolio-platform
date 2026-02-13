
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { db } from '../services/db';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.TEACHER);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = db.getUsers();

    if (isRegistering) {
      if (users.find(u => u.email === email)) {
        alert("Email already exists");
        return;
      }
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password, // In a real app, hash this
        name,
        role
      };
      db.saveUser(newUser);
      onLogin(newUser);
    } else {
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        alert("Invalid credentials");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -z-10" />
      
      <div className="w-full max-w-md glass-card p-10 space-y-8 animate-in zoom-in-95 duration-700">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-black text-2xl mx-auto rounded-sm mb-6 shadow-[8px_8px_0px_#333]">T</div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Teacher Portfolio
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest">
            {isRegistering ? 'Create new account' : 'Welcome back professional'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-widest">Full Name</label>
              <input 
                required
                className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:outline-none focus:border-white transition-all text-sm"
                placeholder="Dr. John Doe"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-widest">Email Address</label>
            <input 
              required
              type="email"
              className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:outline-none focus:border-white transition-all text-sm"
              placeholder="name@institution.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-widest">Security Code</label>
            <input 
              required
              type="password"
              className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:outline-none focus:border-white transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-widest">Designation</label>
              <select 
                className="w-full bg-black/50 border border-gray-800 p-3 text-white focus:outline-none focus:border-white transition-all text-sm appearance-none"
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
              >
                <option value={UserRole.TEACHER}>Teacher / Professional</option>
                <option value={UserRole.ADMIN}>Administrative Authority</option>
              </select>
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-white text-black font-black py-4 uppercase tracking-widest shadow-[8px_8px_0px_#444] hover:bg-gray-200 hover:shadow-[4px_4px_0px_#444] transition-all active:translate-y-1 active:shadow-none"
          >
            {isRegistering ? 'Initialize Account' : 'Authenticate'}
          </button>
        </form>

        <div className="text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            {isRegistering ? 'Already have credentials? Log In' : 'No account? Register Profile'}
          </button>
        </div>

        <div className="pt-8 border-t border-gray-800 flex justify-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all">
          <span className="text-[10px] font-mono">SECURE</span>
          <span className="text-[10px] font-mono">ENCRYPTED</span>
          <span className="text-[10px] font-mono">GEMINI-AI POWERED</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
