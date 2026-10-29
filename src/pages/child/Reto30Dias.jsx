import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Soup, CheckCircle, Flame } from 'lucide-react';
import api from '../../services/api';

export default function Reto30Dias() {
  const navigate = useNavigate();
  const [consumed, setConsumed] = useState(false);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [day, setDay] = useState(1);
  const [error, setError] = useState('');
  
  const childId = localStorage.getItem('puka_child_id');

  useEffect(() => {
    const fetchProgress = async () => {
      if (childId) {
        try {
          const { data } = await api.get(`/consumption/${childId}`);
          // data es un array de consumptions
          const daysCompleted = data.length;
          setDay(daysCompleted + 1); // El siguiente día a registrar
        } catch (error) {
          console.error("Error fetching progress", error);
        }
      }
    };
    fetchProgress();
  }, [childId]);

  const handleConsume = async () => {
    if (!childId) {
      setError("No se pudo identificar tu perfil de aventurero.");
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post(`/consumption/${childId}`, {
        day_number: day,
        is_consumed: true
      });
      
      setConsumed(true);
      setPoints(data.points_earned);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Hubo un problema registrando tu consumo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-puka-bg pb-20">
      <header className="bg-white px-6 py-4 rounded-b-3xl shadow-sm flex items-center sticky top-0 z-10 gap-4">
        <ArrowLeft className="w-6 h-6 text-gray-500 cursor-pointer" onClick={() => navigate('/dashboard')} />
        <h1 className="text-2xl font-black text-gray-800">RETO 30 DÍAS</h1>
      </header>

      <main className="p-6 max-w-lg mx-auto space-y-8 flex flex-col items-center text-center mt-8">
        
        {/* Progreso Circular o Título */}
        <div className="relative w-40 h-40 bg-white rounded-full shadow-lg border-8 border-puka-gold flex items-center justify-center">
          <div className="absolute top-0 right-0 bg-orange-400 text-white p-2 rounded-full shadow-md flex items-center gap-1 -mt-2 -mr-2">
            <Flame className="w-4 h-4" /> ?
          </div>
          <div className="text-center">
            <Soup className="w-12 h-12 text-puka-red mx-auto mb-1" />
            <span className="block font-black text-2xl text-gray-800">{day} / 30</span>
            <span className="block text-xs font-bold text-gray-500">DÍAS</span>
          </div>
        </div>

        {/* Tarjeta de Acción */}
        <div className="w-full bg-white rounded-3xl p-8 shadow-xl border-t-4 border-puka-red">
          <h2 className="text-2xl font-black text-gray-800 mb-6">HOY</h2>
          <p className="text-lg font-semibold text-gray-600 mb-8">¿Tomaste tu ración de Puka Miski?</p>
          
          {error && <div className="text-red-500 font-bold mb-4">{error}</div>}

          {!consumed ? (
            <button 
              onClick={handleConsume}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black text-xl text-white shadow-lg transition transform hover:scale-105 active:scale-95 flex justify-center items-center gap-3
                ${loading ? 'bg-gray-400' : 'bg-puka-green hover:bg-green-700'}`}
            >
              {loading ? (
                'Procesando...'
              ) : (
                <>
                  <CheckCircle className="w-7 h-7" /> ¡SÍ, YA LA TOMÉ!
                </>
              )}
            </button>
          ) : (
            <div className="animate-bounce">
              <div className="bg-yellow-100 p-6 rounded-3xl border-2 border-puka-gold">
                <h3 className="text-2xl font-black text-puka-gold mb-2">¡Excelente!</h3>
                <p className="text-gray-700 font-bold mb-4">Misión cumplida aventurero.</p>
                <span className="inline-block bg-puka-gold text-white font-black px-6 py-2 rounded-full text-xl shadow-md">
                  +{points} ⭐
                </span>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
