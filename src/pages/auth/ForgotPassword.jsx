import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { KeyRound } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.msg); // En dev, aquí viene el código
      // Navegamos al reseteo y pasamos el email en el state para no tener que volver a tipearlo
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 3000);
    } catch (err) {
      setError("Error al solicitar recuperación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-puka-bg p-4 relative overflow-hidden">
      <div className="bg-white p-8 rounded-[3rem] shadow-2xl w-full max-w-md border-4 border-puka-red/10 relative z-10">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-orange-50 p-4 rounded-2xl text-orange-500">
              <KeyRound className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Recuperar Cuenta</h1>
          <p className="text-gray-500 font-semibold">Te enviaremos un código mágico para que puedas volver a entrar.</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl font-bold text-center mb-6">{error}</div>}
        {message && <div className="bg-green-50 text-green-600 p-4 rounded-xl font-bold text-center mb-6">{message}<br/><span className="text-sm">Redirigiendo...</span></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2 ml-1">Correo Electrónico</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-orange-500 focus:outline-none bg-gray-50 text-lg font-semibold"
              placeholder="tu@correo.com"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-orange-600 transition-all mt-4 disabled:opacity-50"
          >
            {loading ? 'Generando código...' : 'Solicitar Código'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <a href="/login" className="text-gray-500 font-bold hover:text-orange-500">Volver a inicio de sesión</a>
        </div>
      </div>
    </div>
  );
}
