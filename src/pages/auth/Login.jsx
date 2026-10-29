import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Shield, Sparkles } from 'lucide-react';
import api from '../../services/api';

export default function Login() {
  const [isChildLogin, setIsChildLogin] = useState(true);
  
  // States for Parent
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // States for Child
  const [accessCode, setAccessCode] = useState('');
  const [pin, setPin] = useState('');
  
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (isChildLogin) {
      try {
        const { data } = await api.post('/auth/login/child', {
          access_code: accessCode,
          pin: pin
        });
        localStorage.setItem('puka_token', data.access_token);
        // Recargar página para que AuthContext lea el token
        window.location.href = '/dashboard';
      } catch (err) {
        setError(err.response?.data?.detail || "Código o PIN incorrecto");
      }
    } else {
      const success = await login(email, password);
      if (!success) setError("Correo o contraseña incorrecta");
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-puka-bg p-4 relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-puka.webp')" }}
    >
      {/* Capa de oscurecimiento sutil para mejorar la legibilidad */}
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Círculos decorativos de fondo (opcional, los mantengo pero más tenues) */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-puka-gold/20 rounded-full mix-blend-multiply blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-puka-red/20 rounded-full mix-blend-multiply blur-3xl"></div>

      <div className="bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl sm:rounded-[3rem] shadow-2xl w-full max-w-md border-4 border-white/50 relative z-10">
        
        {/* Toggle Role */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
          <button 
            onClick={() => setIsChildLogin(true)}
            className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${isChildLogin ? 'bg-white shadow-md text-puka-red' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Sparkles className="w-5 h-5" /> Niños
          </button>
          <button 
            onClick={() => setIsChildLogin(false)}
            className={`flex-1 py-3 rounded-xl font-bold flex justify-center items-center gap-2 transition-all ${!isChildLogin ? 'bg-white shadow-md text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Shield className="w-5 h-5" /> Padres
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-puka-red tracking-tight mb-2">PUKA MISKI</h1>
          <p className="text-gray-500 font-semibold">
            {isChildLogin ? '¡Tu aventura nutritiva comienza aquí!' : 'Panel de Administración Familiar'}
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl font-bold text-center mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isChildLogin ? (
            <>
              <div>
                <label className="block text-gray-700 font-bold mb-2 ml-1">Código de Acceso Secreto</label>
                <input 
                  type="text" 
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-puka-red focus:outline-none bg-gray-50 text-xl font-mono text-center tracking-wider font-bold text-gray-800"
                  placeholder="MATEO-A1B2"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 ml-1">Tu PIN Mágico</label>
                <input 
                  type="password" 
                  maxLength="4"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-puka-red focus:outline-none bg-gray-50 text-2xl text-center tracking-[1em] font-mono font-bold text-gray-800"
                  placeholder="••••"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-gray-700 font-bold mb-2 ml-1">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-puka-red focus:outline-none bg-gray-50 text-lg font-semibold"
                  placeholder="tu@correo.com"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-2 ml-1">Contraseña</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:border-puka-red focus:outline-none bg-gray-50 text-lg"
                  placeholder="••••••••"
                  required
                />
              </div>
            </>
          )}

          <button 
            type="submit" 
            className="w-full bg-puka-red text-white font-black py-4 rounded-2xl shadow-lg shadow-puka-red/30 hover:bg-red-700 transition-all transform hover:scale-[1.02] active:scale-95 text-lg mt-4"
          >
            {isChildLogin ? '¡Entrar a Jugar!' : 'Ingresar'}
          </button>
        </form>

        {/* Acceso a Semilla Puka e Impacto Social */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col gap-2.5 text-center">
          <a 
            href="/semilla-puka" 
            className="inline-flex items-center justify-center gap-2 text-xs font-black text-green-700 bg-green-50 hover:bg-green-100 px-3.5 py-2 rounded-xl transition shadow-sm border border-green-200/60"
          >
            <span>🌱</span> ¿Tienes una caja con código QR? <strong>Entra a Semilla Puka</strong>
          </a>

          <a 
            href="/impacto-social" 
            className="inline-flex items-center justify-center gap-2 text-xs font-black text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition shadow-sm border border-rose-200/60"
          >
            <span>❤️</span> Programa Social <strong>Alimenta una Sonrisa</strong>
          </a>
        </div>

        {/* Links adicionales para padres */}
        {!isChildLogin && (
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3 text-center">
            <a href="/forgot-password" className="text-gray-500 font-bold hover:text-puka-red transition">¿Olvidaste tu contraseña?</a>
            <p className="text-gray-500">¿No tienes cuenta? <a href="/register" className="text-puka-red font-black hover:underline">Regístrate aquí</a></p>
          </div>
        )}
      </div>
    </div>
  );
}
