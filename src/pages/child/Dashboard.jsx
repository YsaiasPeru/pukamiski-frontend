import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Bell, User, Trophy, Star, Flame, Soup, Sprout, Gift, QrCode } from 'lucide-react';
import api from '../../services/api';

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user && user.id) {
          const { data } = await api.get(`/children/${user.id}`);
          setProfile(data);
          // Guardar el child_id para otras vistas
          localStorage.setItem('puka_child_id', data.id);
        }
      } catch (error) {
        console.error("Error fetching child profile", error);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="min-h-screen bg-puka-bg pb-20">
      {/* Header */}
      <header className="bg-white px-6 py-4 rounded-b-3xl shadow-sm flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-black text-puka-red">PUKA MISKI</h1>
        <div className="flex gap-4 text-gray-500">
          <Bell className="w-6 h-6 hover:text-puka-gold cursor-pointer" />
          <User className="w-6 h-6 hover:text-puka-red cursor-pointer" onClick={logout} />
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-lg mx-auto">
        {/* Welcome Card */}
        <section className="bg-gradient-to-br from-puka-red to-red-600 rounded-3xl p-6 text-white shadow-xl transform transition hover:scale-[1.02]">
          <h2 className="text-3xl font-bold mb-4">¡Hola, {user?.name || 'Aventurero'}! 👋</h2>
          
          <div className="space-y-3 font-semibold text-lg">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-white/20 rounded-xl"><Trophy className="w-5 h-5 text-puka-gold" /></span>
              <span>{profile?.level || 'Novato'}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="p-2 bg-white/20 rounded-xl"><Star className="w-5 h-5 text-puka-gold" /></span>
              <span>{profile?.total_points || 0} puntos</span>
            </div>
            <div 
              onClick={() => navigate('/ligas-puka')}
              className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-1.5 rounded-2xl transition"
            >
              <span className="p-2 bg-white/20 rounded-xl"><Flame className="w-5 h-5 text-orange-400" /></span>
              <span className="underline decoration-dotted">{profile?.league || 'Ligas Puka'} ➔</span>
            </div>
          </div>
        </section>

        {/* Reto 30 días Banner */}
        <section 
          onClick={() => navigate('/reto-30-dias')}
          className="bg-white rounded-3xl p-6 shadow-md border-2 border-puka-gold/30 cursor-pointer hover:shadow-xl hover:border-puka-gold transition group"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Soup className="w-7 h-7 text-puka-red" />
              <h3 className="font-bold text-xl text-gray-800 group-hover:text-puka-red transition">RETO 30 DÍAS</h3>
            </div>
            <span className="font-bold text-puka-gold">+10 ⭐</span>
          </div>
          <p className="text-sm text-gray-500 font-bold mb-2">Entra a registrar tu avance</p>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-puka-gold h-4 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </section>

        {/* Banner Semilla Puka (QR del empaque) */}
        <section 
          onClick={() => navigate('/semilla-puka')}
          className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-5 text-white shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition relative overflow-hidden"
        >
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl">
                <QrCode className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xs font-bold text-yellow-300 uppercase tracking-wider">¡Nuevo del Empaque!</span>
                <h3 className="font-black text-xl leading-tight">SEMILLA PUKA</h3>
                <p className="text-xs text-green-100 font-medium">Guía de siembra y fotos de tu maceta (+90 ⭐)</p>
              </div>
            </div>
            <span className="text-2xl animate-bounce">🌱</span>
          </div>
        </section>

        {/* Menu Grid */}
        <section className="grid grid-cols-2 gap-4">
          <MenuCard onClick={() => navigate('/mis-retos')} icon={<Trophy />} color="text-purple-500" bg="bg-purple-100" title="Mis Retos" />
          <MenuCard onClick={() => navigate('/puka-cards')} icon={<div className="font-black text-2xl">🃏</div>} color="text-blue-500" bg="bg-blue-100" title="Puka Cards" />
          <MenuCard onClick={() => navigate('/ligas-puka')} icon={<Flame />} color="text-orange-500" bg="bg-orange-100" title="Ligas Puka" />
          <MenuCard onClick={() => navigate('/recompensas')} icon={<Gift />} color="text-pink-500" bg="bg-pink-100" title="Recompensas" />
          <MenuCard onClick={() => navigate('/semilla-puka')} icon={<QrCode />} color="text-emerald-500" bg="bg-emerald-100" title="Semilla Puka" />
          <MenuCard onClick={() => navigate('/mi-cultivo')} icon={<Sprout />} color="text-puka-green" bg="bg-green-100" title="Mi Cultivo" />
        </section>

        {/* Banner Impacto Social */}
        <section 
          onClick={() => navigate('/impacto-social')}
          className="bg-white rounded-3xl p-4 shadow-sm border border-rose-100 flex items-center justify-between cursor-pointer hover:border-rose-300 transition"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 bg-rose-50 rounded-2xl">❤️</span>
            <div>
              <h4 className="font-black text-gray-800 text-sm">Alimenta una Sonrisa</h4>
              <p className="text-[11px] text-gray-500 font-medium">Conoce nuestro impacto social contra la anemia</p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl">
            Ver ➔
          </span>
        </section>
      </main>
    </div>
  );
}

function MenuCard({ icon, color, bg, title, onClick }) {
  return (
    <div onClick={onClick} className="bg-white p-4 rounded-3xl shadow-sm border-2 border-transparent hover:border-gray-200 cursor-pointer flex flex-col items-center justify-center gap-3 h-32 transition hover:-translate-y-1">
      <div className={`p-4 rounded-2xl ${bg} ${color}`}>
        {React.cloneElement(icon, { className: 'w-8 h-8' })}
      </div>
      <span className="font-bold text-gray-700">{title}</span>
    </div>
  );
}
