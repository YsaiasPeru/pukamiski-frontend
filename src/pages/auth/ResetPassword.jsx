import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Unlock } from 'lucide-react';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si venimos de ForgotPassword, autocompletamos el email
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', { email, code, new_password: newPassword });
      setMessage(res.data.msg);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setError(err.response?.data?.detail || "Código incorrecto o error al cambiar contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-puka-bg p-4 relative overflow-hidden">
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-md border-4 border-green-500/10 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-50 p-4 rounded-2xl text-green-500">
              <Unlock className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Nueva Contraseña</h1>
          <p className="text-gray-500 font-semibold">Ingresa el código mágico de 6 dígitos.</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl font-bold text-center mb-6">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-4 rounded-xl font-bold text-center mb-6">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2 ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:outline-none bg-gray-50 text-lg font-semibold"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 ml-1">Código de 6 Dígitos</label>
            <input 
              type="text" 
              maxLength="6"
              required
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:outline-none bg-gray-50 text-2xl font-mono text-center tracking-widest font-bold text-gray-800"
              placeholder="123456"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 ml-1">Nueva Contraseña</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-green-500 focus:outline-none bg-gray-50 text-lg"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-green-500 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-green-600 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/login" className="text-gray-500 font-bold hover:text-green-600">Cancelar</a>
        </div>
      </div>
    </div>
  );
}
