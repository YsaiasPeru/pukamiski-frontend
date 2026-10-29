import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'PARENT' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || "Error al registrar la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-puka-bg p-4 relative overflow-hidden">
      <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-puka-gold/20 rounded-full mix-blend-multiply blur-3xl"></div>
      
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-md border-4 border-puka-red/10 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-red-50 p-4 rounded-2xl text-puka-red">
              <UserPlus className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Crear Cuenta</h1>
          <p className="text-gray-500 font-semibold">Únete como padre a Puka Miski</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl font-bold text-center mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2 ml-1">Nombre y Apellido</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-puka-red focus:outline-none bg-gray-50 text-lg font-semibold"
              placeholder="Juan Pérez"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-puka-red focus:outline-none bg-gray-50 text-lg font-semibold"
              placeholder="tu@correo.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2 ml-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-puka-red focus:outline-none bg-gray-50 text-lg"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-puka-red text-white font-black py-4 rounded-2xl shadow-lg hover:bg-red-700 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 font-bold">
            ¿Ya tienes cuenta? <a href="/login" className="text-puka-red hover:underline">Inicia Sesión</a>
          </p>
        </div>
      </div>
    </div>
  );
}
