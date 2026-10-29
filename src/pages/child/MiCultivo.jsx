import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Droplet, Sprout, TreeDeciduous, Star, Info } from 'lucide-react';
import api from '../../services/api';

export default function MiCultivo() {
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [watering, setWatering] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchPlant();
  }, []);

  const fetchPlant = async () => {
    try {
      const { data } = await api.get('/children/me/plant');
      setPlant(data);
    } catch (error) {
      console.error("Error fetching plant", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWater = async () => {
    if (watering) return;
    setWatering(true);
    setMessage(null);
    try {
      const { data } = await api.post('/children/me/plant/water');
      setMessage({ type: 'success', text: data.msg });
      // Play a little animation/timeout before fetching new state
      setTimeout(() => {
        fetchPlant();
        setMessage(null);
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.detail || "Error al regar" });
    } finally {
      setWatering(false);
    }
  };

  const renderPlantImage = (status) => {
    if (status === 'SIEMBRA') {
      return (
        <div className="w-48 h-48 bg-amber-900 rounded-full mx-auto flex items-end justify-center pb-4 shadow-inner overflow-hidden border-8 border-amber-800 relative">
          <div className="w-10 h-6 bg-green-700 rounded-t-full relative z-10 animate-bounce"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      );
    } else if (status === 'CRECIMIENTO') {
      return (
        <div className="w-48 h-48 bg-amber-900 rounded-full mx-auto flex items-end justify-center pb-4 shadow-inner overflow-hidden border-8 border-amber-800 relative">
          <Sprout className="w-24 h-24 text-green-500 relative z-10 animate-pulse" strokeWidth={1.5} />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      );
    } else {
      return (
        <div className="w-48 h-48 bg-amber-900 rounded-full mx-auto flex items-end justify-center pb-2 shadow-inner overflow-hidden border-8 border-amber-800 relative">
          <TreeDeciduous className="w-36 h-36 text-green-500 relative z-10" strokeWidth={1.5} />
          <div className="absolute top-10 left-10 text-2xl animate-bounce">🍎</div>
          <div className="absolute top-16 right-10 text-2xl animate-bounce" style={{animationDelay: '0.5s'}}>🍎</div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      );
    }
  };

  const getStatusText = (status) => {
    if (status === 'SIEMBRA') return 'Pequeño Brote 🌱';
    if (status === 'CRECIMIENTO') return 'Planta Creciendo 🌿';
    return 'Planta Madura con Frutos 🍎';
  };

  return (
    <div className="min-h-screen bg-green-50 pb-20 font-sans">
      <header className="bg-green-600 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-green-700 rounded-full hover:bg-green-800 transition">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            Mi Cultivo
          </h1>
        </div>
      </header>

      <main className="p-6 max-w-lg mx-auto space-y-8 animate-fade-in text-center mt-6">
        
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-green-100 relative">
          <h2 className="text-2xl font-black text-green-800 mb-2">Tu {plant?.crop_name || 'Planta'}</h2>
          <p className="text-green-600 font-bold mb-8">{plant ? getStatusText(plant.status) : 'Cargando...'}</p>

          <div className="mb-10 relative">
            {plant && renderPlantImage(plant.status)}
            
            {/* Water drop animation when watering */}
            {watering && (
              <div className="absolute inset-0 flex items-center justify-center animate-bounce">
                <Droplet className="w-16 h-16 text-blue-400 fill-blue-400 opacity-80" />
              </div>
            )}
          </div>

          {/* Progress bar */}
          {plant && (
            <div className="mb-8 bg-gray-100 rounded-full h-4 overflow-hidden relative">
              <div 
                className="bg-blue-400 h-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.min((plant.water_points / 6) * 100, 100)}%` }}
              ></div>
            </div>
          )}

          <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl mb-6 flex gap-3 text-left">
            <Info className="w-6 h-6 shrink-0 text-blue-500" />
            <p className="text-sm font-semibold">
              Riega tu planta usando <strong>10 ⭐</strong>. 
              <br/>
              ¡Al llegar a 6 riegos dará frutos!
            </p>
          </div>

          <button 
            onClick={handleWater}
            disabled={watering || (plant && plant.status === 'COSECHA')}
            className={`w-full py-4 rounded-2xl font-black text-xl flex justify-center items-center gap-3 transition-transform shadow-lg ${
              plant?.status === 'COSECHA' 
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
            }`}
          >
            <Droplet className="w-6 h-6 fill-current" />
            {plant?.status === 'COSECHA' ? '¡Misión Cumplida!' : 'Regar (10 ⭐)'}
          </button>
        </div>

        {/* Message Modal */}
        {message && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-slide-up">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${message.type === 'error' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500'}`}>
                {message.type === 'error' ? <span className="text-4xl">❌</span> : <Droplet className="w-10 h-10 fill-current" />}
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">
                {message.type === 'error' ? '¡Ups!' : '¡Qué refrescante!'}
              </h3>
              <p className="text-gray-600 font-semibold mb-6">{message.text}</p>
              {message.type === 'error' && (
                <button 
                  onClick={() => setMessage(null)}
                  className="w-full py-4 bg-gray-800 text-white font-black rounded-2xl active:scale-95 transition-all shadow-lg"
                >
                  Entendido
                </button>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
