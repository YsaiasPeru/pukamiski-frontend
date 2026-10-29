import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Trophy, Flame, Shield, Star, 
  ChevronUp, Sparkles, Clock, AlertCircle, Info 
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

export default function LigasPuka() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLeagueInfo, setShowLeagueInfo] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data } = await api.get('/children/me/leaderboard');
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard", error);
    } finally {
      setLoading(false);
    }
  };

  const ligas = [
    { name: "Liga Bronce", icon: "🥉", color: "from-amber-700 to-amber-900", border: "border-amber-700", min: "0 - 150 ⭐", desc: "El inicio de tu viaje aventurero" },
    { name: "Liga Plata", icon: "🥈", color: "from-slate-400 to-slate-600", border: "border-slate-400", min: "151 - 350 ⭐", desc: "Dominando los granos andinos" },
    { name: "Liga Oro", icon: "🥇", color: "from-yellow-400 to-amber-500", border: "border-yellow-400", min: "351 - 650 ⭐", desc: "Verdaderos guerreros del hierro" },
    { name: "Liga Diamante", icon: "💎", color: "from-cyan-400 to-blue-600", border: "border-cyan-400", min: "651 - 1000 ⭐", desc: "Élite de la nutrición Pukamisky" },
    { name: "Liga Suprema Puka", icon: "👑", color: "from-purple-600 via-pink-600 to-amber-500", border: "border-purple-500", min: "1000+ ⭐", desc: "Los máximos guardianes de la salud" },
  ];

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return <span className="w-7 h-7 flex items-center justify-center font-black text-gray-500 text-sm bg-gray-100 rounded-full">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-red-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-b-3xl shadow-sm flex items-center justify-between sticky top-0 z-20 border-b border-amber-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-puka-red">Competencia Amistosa</span>
            <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
              Ligas Puka <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            </h1>
          </div>
        </div>

        <button 
          onClick={() => setShowLeagueInfo(!showLeagueInfo)}
          className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-2xl transition text-xs font-bold flex items-center gap-1.5"
        >
          <Info className="w-4 h-4" />
          <span>Ligas</span>
        </button>
      </header>

      <main className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">

        {/* HERO CARD DE LA LIGA ACTUAL */}
        <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-puka-red rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-yellow-200 text-xs font-black px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5" /> Temporada Semanal: 3 días restantes
            </span>
            <span className="text-2xl animate-pulse">⚡</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center text-4xl shadow-inner border border-white/30">
              {leaderboard?.league.includes('Oro') ? '🥇' : (leaderboard?.league.includes('Plata') ? '🥈' : (leaderboard?.league.includes('Diamante') ? '💎' : '🥉'))}
            </div>
            <div>
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">Tu Liga Actual</span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                {leaderboard?.league || 'Cargando Liga...'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-black bg-black/20 px-2.5 py-0.5 rounded-lg text-yellow-300">
                  Puesto #{leaderboard?.my_rank || 1}
                </span>
                <span className="text-xs font-medium text-amber-100">
                  {leaderboard?.my_points || 0} ⭐ acumuladas
                </span>
              </div>
            </div>
          </div>

          {/* Indicador de Zona de Ascenso */}
          <div className="bg-black/15 backdrop-blur-sm p-3 rounded-2xl border border-white/15 flex items-center gap-2 text-xs font-bold">
            <ChevronUp className="w-5 h-5 text-green-300 shrink-0 animate-bounce" />
            <span>
              {leaderboard?.my_rank <= 3 
                ? "¡Estás en la Zona de Ascenso! Al terminar la semana subirás a la siguiente liga 🚀" 
                : "¡Estás muy cerca del podio! Completa más retos para entrar al Top 3 y ascender 🎯"}
            </span>
          </div>
        </div>

        {/* MODAL / DESPLEGABLE DE TODAS LAS LIGAS */}
        {showLeagueInfo && (
          <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-amber-200 space-y-3 animate-slide-up">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-black text-gray-800 text-sm">Jerarquía de las 5 Ligas Puka</h3>
              <button onClick={() => setShowLeagueInfo(false)} className="text-xs font-bold text-gray-400 hover:text-gray-600">Cerrar ✕</button>
            </div>
            {ligas.map((l, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{l.icon}</span>
                  <div>
                    <h4 className="font-black text-gray-800 text-xs">{l.name}</h4>
                    <p className="text-[10px] text-gray-500 font-medium">{l.desc}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-amber-700 bg-amber-50 px-2 py-1 rounded-xl">
                  {l.min}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TABLA TOP 10 SEMANAL */}
        <div className="bg-white rounded-[2.5rem] p-5 sm:p-6 shadow-md border border-amber-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Ranking Semanal (Top 10)
            </h3>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              En Vivo
            </span>
          </div>

          <div className="space-y-2.5">
            {leaderboard?.top_10.map((comp) => {
              const isTop3 = comp.rank <= 3;
              const isMe = comp.is_me;

              return (
                <div 
                  key={comp.rank}
                  className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                    isMe 
                      ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 border-2 border-amber-400 shadow-md scale-[1.02]' 
                      : (isTop3 ? 'bg-amber-50/60 border border-amber-100 hover:bg-amber-50' : 'bg-gray-50/80 border border-gray-100 hover:bg-gray-100')
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center">
                      {getRankBadge(comp.rank)}
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl border border-gray-100">
                      {comp.avatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-black text-sm ${isMe ? 'text-puka-red' : 'text-gray-800'}`}>
                          {comp.name}
                        </span>
                        {isMe && (
                          <span className="text-[10px] font-black bg-puka-red text-white px-2 py-0.5 rounded-full uppercase">
                            Tú
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-gray-500">
                        {isTop3 ? '🚀 Ascenso a la vista' : 'Puesto asegurado'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-amber-700 text-sm flex items-center gap-1 justify-end">
                      {comp.points} <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">puntos</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CÓMO SUMAR MÁS PUNTOS */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-5 text-white shadow-md flex items-center justify-between">
          <div>
            <h4 className="font-black text-base">¿Quieres escalar al 1er lugar?</h4>
            <p className="text-purple-100 text-xs font-medium">Completa retos diarios o cuida tu semilla</p>
          </div>
          <button 
            onClick={() => navigate('/mis-retos')}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-purple-950 font-black text-xs rounded-xl shadow transition active:scale-95 shrink-0"
          >
            Ir a Retos ➔
          </button>
        </div>

      </main>
    </div>
  );
}
