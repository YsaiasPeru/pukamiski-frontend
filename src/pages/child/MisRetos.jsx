import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, CheckCircle2, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';

export default function MisRetos() {
  const navigate = useNavigate();
  const [retos, setRetos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchRetos();
  }, []);

  const fetchRetos = async () => {
    try {
      const { data } = await api.get('/children/me/challenges');
      setRetos(data);
    } catch (error) {
      console.error("Error al cargar retos", error);
    } finally {
      setLoading(false);
    }
  };

  const completarReto = async (id, points) => {
    try {
      await api.post(`/children/me/challenges/${id}/complete`);
      
      // Animación de Confeti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF3B30', '#FFCC00', '#4CD964', '#5AC8FA']
      });

      // Refrescar lista
      fetchRetos();
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Error al completar el reto");
    }
  };

  const getCardStyle = (type) => {
    switch(type) {
      case 'DAILY': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'WEEKLY': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'SPECIAL': return 'bg-orange-50 border-orange-200 text-orange-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-puka-bg pb-20">
      <header className="bg-white px-6 py-4 rounded-b-3xl shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-2">
          <Target className="text-puka-red" /> Mis Retos
        </h1>
      </header>

      <main className="p-6 max-w-lg mx-auto space-y-6 animate-fade-in">
        
        {/* Error Modal */}
        {errorMessage && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-slide-up">
              <div className="w-20 h-20 bg-red-100 text-puka-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⚠️</span>
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">¡Ups!</h3>
              <p className="text-gray-600 font-semibold mb-6">{errorMessage}</p>
              <button 
                onClick={() => setErrorMessage(null)}
                className="w-full py-4 bg-puka-red text-white font-black rounded-2xl hover:bg-red-700 active:scale-95 transition-all shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 text-center">
          <Gift className="w-12 h-12 text-puka-gold mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-800">¡Completa Misiones!</h2>
          <p className="text-gray-500 mt-2 font-semibold">Gana puntos (⭐) para abrir sobres de Puka Cards y reclamar premios increíbles.</p>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center font-bold text-gray-500">Buscando misiones...</p>
          ) : retos.length === 0 ? (
            <p className="text-center font-bold text-gray-500">No hay misiones activas por ahora.</p>
          ) : (
            retos.map((reto) => (
              <div 
                key={reto.id} 
                className={`p-6 rounded-3xl border-2 transition-all ${getCardStyle(reto.type)} ${reto.is_completed ? 'opacity-60 grayscale' : 'hover:-translate-y-1 hover:shadow-lg'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-xl">{reto.name}</h3>
                  <span className="bg-white px-3 py-1 rounded-xl font-black shadow-sm">
                    +{reto.points} ⭐
                  </span>
                </div>
                <p className="font-semibold text-sm opacity-80 mb-4">{reto.description}</p>
                
                {reto.is_completed ? (
                  <div className="flex items-center justify-center gap-2 bg-white/50 py-3 rounded-2xl font-black text-green-600">
                    <CheckCircle2 className="w-6 h-6" /> ¡Completado!
                  </div>
                ) : (
                  <button 
                    onClick={() => completarReto(reto.id, reto.points)}
                    className="w-full bg-white text-gray-900 py-3 rounded-2xl font-black shadow-sm hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    Marcar como Hecho
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
