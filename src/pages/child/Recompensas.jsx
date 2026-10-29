import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Gift, Star, Download, CheckCircle2, 
  Sparkles, Ticket, Image as ImageIcon, Award, X, QrCode 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

export default function Recompensas() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [totalPoints, setTotalPoints] = useState(0);
  const [activeTab, setActiveTab] = useState('wallpapers'); // 'wallpapers' | 'stickers' | 'cupones'
  const [redeemedItems, setRedeemedItems] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null); // Para modal de canje exitoso
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    // Cargar historial local de canjes
    const saved = localStorage.getItem('puka_redeemed_rewards');
    if (saved) {
      try { setRedeemedItems(JSON.parse(saved)); } catch (e) {}
    }
    fetchPoints();
  }, [user]);

  const fetchPoints = async () => {
    try {
      if (user && user.id) {
        const { data } = await api.get(`/children/${user.id}`);
        setTotalPoints(data.total_points || 0);
      }
    } catch (error) {
      console.error("Error fetching points", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward) => {
    if (totalPoints < reward.cost) {
      setToastMessage({
        type: 'error',
        text: `¡Te faltan ${reward.cost - totalPoints} ⭐ para canjear este premio!`
      });
      return;
    }

    setRedeemingId(reward.id);
    try {
      const { data } = await api.post('/children/me/rewards/redeem', {
        reward_id: reward.id,
        title: reward.title,
        cost: reward.cost
      });

      // Actualizar puntos
      setTotalPoints(data.remaining_points);

      // Guardar en canjeados
      const updated = [...redeemedItems, reward.id];
      setRedeemedItems(updated);
      localStorage.setItem('puka_redeemed_rewards', JSON.stringify(updated));

      // Confeti de celebración
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });

      // Abrir modal de éxito
      setSelectedReward(reward);
    } catch (error) {
      setToastMessage({
        type: 'error',
        text: error.response?.data?.detail || "Error al procesar el canje"
      });
    } finally {
      setRedeemingId(null);
    }
  };

  const wallpapers = [
    {
      id: "wall-1",
      title: "Puka en las Cumbres Andinas",
      cost: 50,
      desc: "Wallpaper HD para tablet o celular con Puka en Machu Picchu",
      imageUrl: "/bg-puka.webp",
      previewEmoji: "🏔️",
      downloadUrl: "/bg-puka.webp"
    },
    {
      id: "wall-2",
      title: "Guerrero Dorado del Hierro",
      cost: 75,
      desc: "Wallpaper especial con armadura dorada y energía inca",
      imageUrl: "/puka.png",
      previewEmoji: "⚔️",
      downloadUrl: "/puka.png"
    },
    {
      id: "wall-3",
      title: "Puka y el Jardín Mágico",
      cost: 90,
      desc: "Wallpaper de la Semilla Puka floreciendo llena de vida",
      imageUrl: "/bg-puka.webp",
      previewEmoji: "🌸",
      downloadUrl: "/bg-puka.webp"
    }
  ];

  const stickers = [
    {
      id: "stk-1",
      title: "Insignia Come-Hierro",
      cost: 30,
      desc: "Emblema para tu perfil de guerrero invencible",
      emoji: "🩸",
      badgeColor: "bg-red-500"
    },
    {
      id: "stk-2",
      title: "Sticker Puka Corazón Feliz",
      cost: 40,
      desc: "Sticker digital animado para presumir en tus retos",
      emoji: "💖",
      badgeColor: "bg-pink-500"
    },
    {
      id: "stk-3",
      title: "Medalla Guardián de la Tierra",
      cost: 60,
      desc: "Distintivo ecológico por sembrar y cuidar la naturaleza",
      emoji: "🌱",
      badgeColor: "bg-emerald-500"
    }
  ];

  const cupones = [
    {
      id: "cup-1",
      title: "15% de Descuento en Caja Pukamisky",
      cost: 100,
      desc: "Muestra este cupón en el stand de la feria para tu descuento",
      code: "PUKA-FERIA-15",
      emoji: "🎟️"
    },
    {
      id: "cup-2",
      title: "Sticker Físico de Colección Gratis",
      cost: 40,
      desc: "Canjeable en el módulo de atención en la feria",
      code: "STICKER-PUKA-FERIA",
      emoji: "🎁"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-rose-50 to-amber-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-b-3xl shadow-sm flex items-center justify-between sticky top-0 z-20 border-b border-pink-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-pink-600">Tienda Oficial</span>
            <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
              Recompensas <Gift className="w-5 h-5 text-pink-500" />
            </h1>
          </div>
        </div>

        {/* Puntos Disponibles */}
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-2xl shadow-sm">
          <Star className="w-4 h-4 fill-amber-950" />
          <span>{totalPoints} ⭐</span>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">

        {/* HERO BANNER */}
        <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-yellow-200 text-xs font-black px-3 py-1 rounded-full mb-3">
              🎉 Canjea tus Estrellas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2">
              Centro de Recompensas
            </h2>
            <p className="text-pink-100 text-xs sm:text-sm font-medium">
              ¡Tu esfuerzo y nutrición dan frutos! Canjea tus estrellas ganadas por fondos de pantalla de Puka, stickers virtuales y cupones para la feria.
            </p>
          </div>
        </div>

        {/* SELECTOR DE PESTAÑAS */}
        <div className="flex bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-pink-100">
          <button 
            onClick={() => setActiveTab('wallpapers')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'wallpapers' 
                ? 'bg-pink-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-pink-700'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Fondos HD</span>
          </button>

          <button 
            onClick={() => setActiveTab('stickers')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'stickers' 
                ? 'bg-pink-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-pink-700'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Insignias</span>
          </button>

          <button 
            onClick={() => setActiveTab('cupones')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'cupones' 
                ? 'bg-pink-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-pink-700'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Cupones Feria</span>
          </button>
        </div>

        {/* TAB 1: WALLPAPERS */}
        {activeTab === 'wallpapers' && (
          <div className="space-y-4 animate-fade-in">
            {wallpapers.map((wall) => {
              const isRedeemed = redeemedItems.includes(wall.id);

              return (
                <div key={wall.id} className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-28 h-28 bg-gradient-to-br from-pink-100 to-amber-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner shrink-0 overflow-hidden relative">
                    <img src={wall.imageUrl} alt={wall.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-black text-gray-800 text-base">{wall.title}</h3>
                    <p className="text-gray-500 text-xs font-medium mb-3">{wall.desc}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="font-black text-amber-600 text-sm flex items-center gap-1">
                        {wall.cost} <Star className="w-4 h-4 fill-amber-500" />
                      </span>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto shrink-0">
                    {isRedeemed ? (
                      <a 
                        href={wall.downloadUrl} 
                        download="Puka-Wallpaper.png"
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4" />
                        <span>Descargar HD</span>
                      </a>
                    ) : (
                      <button 
                        onClick={() => handleRedeem(wall)}
                        disabled={redeemingId === wall.id}
                        className={`w-full sm:w-auto px-4 py-2.5 font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 ${
                          totalPoints >= wall.cost 
                            ? 'bg-pink-600 hover:bg-pink-700 text-white active:scale-95' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Gift className="w-4 h-4" />
                        <span>{redeemingId === wall.id ? 'Canjeando...' : 'Canjear'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: STICKERS E INSIGNIAS */}
        {activeTab === 'stickers' && (
          <div className="space-y-4 animate-fade-in">
            {stickers.map((stk) => {
              const isRedeemed = redeemedItems.includes(stk.id);

              return (
                <div key={stk.id} className="bg-white rounded-3xl p-5 shadow-sm border border-pink-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-14 h-14 ${stk.badgeColor} text-white rounded-2xl flex items-center justify-center text-3xl shadow-md shrink-0`}>
                      {stk.emoji}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-800 text-sm sm:text-base">{stk.title}</h3>
                      <p className="text-gray-500 text-xs font-medium">{stk.desc}</p>
                      <span className="font-black text-amber-600 text-xs flex items-center gap-1 mt-1">
                        {stk.cost} <Star className="w-3.5 h-3.5 fill-amber-500" />
                      </span>
                    </div>
                  </div>

                  <div>
                    {isRedeemed ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-green-700 bg-green-100 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" /> En tu Perfil
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleRedeem(stk)}
                        disabled={redeemingId === stk.id}
                        className={`px-4 py-2.5 font-black text-xs rounded-xl shadow transition ${
                          totalPoints >= stk.cost 
                            ? 'bg-pink-600 hover:bg-pink-700 text-white active:scale-95' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Canjear
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: CUPONES FERIA */}
        {activeTab === 'cupones' && (
          <div className="space-y-4 animate-fade-in">
            {cupones.map((cup) => {
              const isRedeemed = redeemedItems.includes(cup.id);

              return (
                <div key={cup.id} className="bg-white rounded-3xl p-5 shadow-sm border-2 border-amber-200/80 relative overflow-hidden">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{cup.emoji}</span>
                      <div>
                        <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                          Exclusivo Stand Feria
                        </span>
                        <h3 className="font-black text-gray-800 text-base mt-1">{cup.title}</h3>
                      </div>
                    </div>
                    <span className="font-black text-amber-600 text-sm flex items-center gap-1">
                      {cup.cost} <Star className="w-4 h-4 fill-amber-500" />
                    </span>
                  </div>

                  <p className="text-gray-500 text-xs font-medium mb-4">{cup.desc}</p>

                  {isRedeemed ? (
                    <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-3.5 rounded-2xl text-center">
                      <span className="text-[11px] font-bold text-amber-800 block mb-1">Muestra este código al jurado/anfitriona:</span>
                      <span className="text-lg font-mono font-black text-puka-red tracking-wider bg-white px-3 py-1 rounded-xl shadow-sm inline-block">
                        {cup.code}
                      </span>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleRedeem(cup)}
                      disabled={redeemingId === cup.id}
                      className={`w-full py-3 font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 ${
                        totalPoints >= cup.cost 
                          ? 'bg-amber-500 hover:bg-amber-600 text-white active:scale-95' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Ticket className="w-4 h-4" />
                      <span>{redeemingId === cup.id ? 'Canjeando...' : 'Obtener Cupón'}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* MODAL CANJE EXITOSO */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-6 max-w-sm w-full text-center shadow-2xl relative animate-slide-up border-4 border-pink-100">
            <button 
              onClick={() => setSelectedReward(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
              🎁
            </div>

            <h3 className="text-2xl font-black text-gray-800 mb-1">¡Recompensa Desbloqueada!</h3>
            <p className="text-gray-500 text-xs font-semibold mb-4">
              Has canjeado exitosamente <strong className="text-pink-600">{selectedReward.title}</strong>
            </p>

            {selectedReward.code && (
              <div className="bg-amber-50 border-2 border-dashed border-amber-300 p-4 rounded-2xl mb-4">
                <span className="text-xs text-amber-800 font-bold block mb-1">Tu Código Oficial de Feria:</span>
                <span className="text-xl font-mono font-black text-puka-red tracking-wider">
                  {selectedReward.code}
                </span>
              </div>
            )}

            {selectedReward.downloadUrl && (
              <a 
                href={selectedReward.downloadUrl}
                download="Puka-Wallpaper.png"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-black text-sm rounded-2xl shadow transition inline-flex items-center justify-center gap-2 mb-3"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Wallpaper Ahora</span>
              </a>
            )}

            <button 
              onClick={() => setSelectedReward(null)}
              className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-black text-sm rounded-2xl transition"
            >
              ¡Seguir explorando!
            </button>
          </div>
        </div>
      )}

      {/* TOAST FLOTANTE */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] animate-slide-up">
          <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 text-white font-bold text-sm ${
            toastMessage.type === 'error' ? 'bg-red-500' : 'bg-green-600'
          }`}>
            <Sparkles className="w-5 h-5 shrink-0" />
            <span className="flex-1">{toastMessage.text}</span>
            <button onClick={() => setToastMessage(null)} className="p-1 hover:bg-white/20 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
