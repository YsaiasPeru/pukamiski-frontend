import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Sparkles, Plus, Trash2, Search, Filter, 
  Star, Eye, RefreshCw, X, Check, Flame, Award, Shield
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';

const RARITY_BADGES = {
  COMMON: { label: 'Común', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', glow: 'shadow-emerald-500/20', border: 'border-emerald-400', color: 'from-emerald-500 to-teal-600', drop: '70%' },
  RARE: { label: 'Rara', bg: 'bg-sky-100 text-sky-800 border-sky-300', glow: 'shadow-sky-500/20', border: 'border-sky-400', color: 'from-sky-500 to-blue-600', drop: '20%' },
  EPIC: { label: 'Épica', bg: 'bg-purple-100 text-purple-800 border-purple-300', glow: 'shadow-purple-500/30', border: 'border-purple-400', color: 'from-purple-500 to-indigo-600', drop: '9%' },
  LEGENDARY: { label: 'Legendaria', bg: 'bg-amber-100 text-amber-800 border-amber-300', glow: 'shadow-amber-500/40', border: 'border-amber-400', color: 'from-amber-400 via-orange-500 to-yellow-600', drop: '1%' },
};

const CATEGORY_ICONS = {
  NATURALEZA: '🌱',
  VALORES: '🤝',
  CONOCIMIENTOS: '🏛️',
  HABILIDADES: '⚡',
};

export default function PukaCardsVista() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRarity, setSelectedRarity] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal Crear
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'NATURALEZA',
    rarity: 'COMMON',
    description: '',
  });

  // Simulador de Sobre
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [packCards, setPackCards] = useState([]);
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [packOpened, setPackOpened] = useState(false);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/cards/catalog');
      setCards(data || []);
    } catch (error) {
      console.error("Error al cargar cartas", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/admin/cards', formData);
      setCards(prev => [data, ...prev]);
      setIsCreateOpen(false);
      setFormData({ name: '', category: 'NATURALEZA', rarity: 'COMMON', description: '' });
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (error) {
      alert("Error al crear la carta: " + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta carta del catálogo?")) return;
    try {
      await api.delete(`/admin/cards/${id}`);
      setCards(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      alert("Error al eliminar carta: " + (error.response?.data?.detail || error.message));
    }
  };

  // Simulador de Apertura de Sobre (3 cartas)
  const simulateOpenPack = () => {
    if (cards.length === 0) return;
    setIsOpeningPack(true);
    setPackOpened(false);

    // Sistema Gacha real
    setTimeout(() => {
      const drawn = [];
      for (let i = 0; i < 3; i++) {
        const rand = Math.random();
        let targetRarity = 'COMMON';
        if (rand < 0.01) targetRarity = 'LEGENDARY';
        else if (rand < 0.10) targetRarity = 'EPIC';
        else if (rand < 0.30) targetRarity = 'RARE';
        else targetRarity = 'COMMON';

        let pool = cards.filter(c => c.rarity === targetRarity);
        if (pool.length === 0) pool = cards;
        const picked = pool[Math.floor(Math.random() * pool.length)];
        drawn.push(picked);
      }

      setPackCards(drawn);
      setIsOpeningPack(false);
      setPackOpened(true);

      const hasLegendary = drawn.some(c => c.rarity === 'LEGENDARY');
      const hasEpic = drawn.some(c => c.rarity === 'EPIC');

      confetti({
        particleCount: hasLegendary ? 150 : hasEpic ? 90 : 50,
        spread: 80,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  // Filtrado
  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRarity = selectedRarity === 'ALL' || card.rarity === selectedRarity;
    const matchesCategory = selectedCategory === 'ALL' || card.category === selectedCategory;
    return matchesSearch && matchesRarity && matchesCategory;
  });

  const countByRarity = {
    TOTAL: cards.length,
    COMMON: cards.filter(c => c.rarity === 'COMMON').length,
    RARE: cards.filter(c => c.rarity === 'RARE').length,
    EPIC: cards.filter(c => c.rarity === 'EPIC').length,
    LEGENDARY: cards.filter(c => c.rarity === 'LEGENDARY').length,
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-puka-red bg-red-50 px-3 py-1 rounded-full border border-red-100">
            Módulo Gamificado
          </span>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight mt-1 flex items-center gap-3">
            Puka Cards <span className="text-2xl">🃏</span>
          </h2>
          <p className="text-gray-500 font-semibold text-sm">
            Catálogo oficial de cartas coleccionables de superalimentos y valores andinos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => { setIsSimulatorOpen(true); setPackOpened(false); setPackCards([]); }}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/25 transition active:scale-95"
          >
            <Sparkles className="w-5 h-5" /> Simular Sobre Puka
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-puka-red hover:bg-puka-red/90 text-white font-black px-5 py-3 rounded-2xl shadow-lg shadow-puka-red/25 transition active:scale-95"
          >
            <Plus className="w-5 h-5" /> Nueva Carta
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-xs text-gray-400 font-bold">Total Cartas</p>
          <p className="text-2xl font-black text-gray-800 mt-1">{countByRarity.TOTAL}</p>
          <span className="text-[10px] text-gray-400 font-bold">En el álbum</span>
        </div>
        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 text-center">
          <p className="text-xs text-emerald-700 font-bold">Comunes (70%)</p>
          <p className="text-2xl font-black text-emerald-800 mt-1">{countByRarity.COMMON}</p>
          <span className="text-[10px] text-emerald-600 font-bold">Base del juego</span>
        </div>
        <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 text-center">
          <p className="text-xs text-sky-700 font-bold">Raras (20%)</p>
          <p className="text-2xl font-black text-sky-800 mt-1">{countByRarity.RARE}</p>
          <span className="text-[10px] text-sky-600 font-bold">Poder medio</span>
        </div>
        <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 text-center">
          <p className="text-xs text-purple-700 font-bold">Épicas (9%)</p>
          <p className="text-2xl font-black text-purple-800 mt-1">{countByRarity.EPIC}</p>
          <span className="text-[10px] text-purple-600 font-bold">Gran valor</span>
        </div>
        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-center col-span-2 md:col-span-1">
          <p className="text-xs text-amber-700 font-bold">Legendarias (1%)</p>
          <p className="text-2xl font-black text-amber-800 mt-1">{countByRarity.LEGENDARY}</p>
          <span className="text-[10px] text-amber-600 font-bold">¡Oro puro!</span>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-puka-red"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Filtro Rareza */}
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-puka-red"
          >
            <option value="ALL">Todas las Rarezas</option>
            <option value="COMMON">🟢 Común</option>
            <option value="RARE">🔵 Rara</option>
            <option value="EPIC">🟣 Épica</option>
            <option value="LEGENDARY">🟡 Legendaria</option>
          </select>

          {/* Filtro Categoría */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-puka-red"
          >
            <option value="ALL">Todas las Categorías</option>
            <option value="NATURALEZA">🌱 Naturaleza</option>
            <option value="VALORES">🤝 Valores</option>
            <option value="CONOCIMIENTOS">🏛️ Conocimientos</option>
            <option value="HABILIDADES">⚡ Habilidades</option>
          </select>
        </div>
      </div>

      {/* Grid de Cartas */}
      {loading ? (
        <div className="text-center py-16">
          <RefreshCw className="w-8 h-8 text-puka-red animate-spin mx-auto mb-2" />
          <p className="text-gray-500 font-bold text-sm">Cargando catálogo de cartas...</p>
        </div>
      ) : filteredCards.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-300">
          <Gamepad2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 font-bold">No se encontraron cartas con esos filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredCards.map((card) => {
            const badge = RARITY_BADGES[card.rarity] || RARITY_BADGES.COMMON;
            const catIcon = CATEGORY_ICONS[card.category] || '✨';

            return (
              <div 
                key={card.id}
                className={`bg-white rounded-2xl border-2 ${badge.border} p-3 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative overflow-hidden group`}
              >
                {/* Header de la carta */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black tracking-wider text-gray-400">
                      {card.code || 'PUKA-CARD'}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  {/* Icono central / Arte de la carta */}
                  <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${badge.color} flex flex-col items-center justify-center text-white p-3 shadow-inner relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
                    <span className="text-4xl drop-shadow-md mb-1 transform group-hover:scale-110 transition duration-200">
                      {catIcon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
                      {card.category}
                    </span>
                  </div>

                  {/* Nombre y descripción */}
                  <h4 className="font-black text-gray-800 text-sm mt-2.5 truncate" title={card.name}>
                    {card.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                    {card.description || 'Carta coleccionable oficial Puka Miski.'}
                  </p>
                </div>

                {/* Footer con acciones */}
                <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400">
                    Prob: {badge.drop}
                  </span>
                  <button
                    onClick={() => handleDelete(card.id)}
                    title="Eliminar carta"
                    className="p-1.5 text-gray-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Simulador de Sobre */}
      {isSimulatorOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-amber-500/30 text-white rounded-[2.5rem] max-w-xl w-full p-6 md:p-8 relative shadow-2xl overflow-hidden text-center">
            <button
              onClick={() => setIsSimulatorOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-full bg-gray-800/60"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Demostración para la Feria
            </span>
            <h3 className="text-2xl md:text-3xl font-black mt-2">
              🎲 Simulador de Sobre Puka
            </h3>
            <p className="text-gray-400 text-xs md:text-sm mt-1 max-w-md mx-auto">
              Experimenta lo que siente un niño al canjear 50 estrellas por un sobre misterioso de superalimentos.
            </p>

            {/* Vista del sobre cerrado */}
            {!packOpened && (
              <div className="py-8 flex flex-col items-center">
                <div className={`w-44 h-60 rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 p-1 shadow-2xl shadow-orange-500/30 flex flex-col items-center justify-between text-gray-900 relative cursor-pointer transform hover:scale-105 transition duration-300 ${isOpeningPack ? 'animate-bounce' : ''}`}
                     onClick={!isOpeningPack ? simulateOpenPack : undefined}>
                  <div className="w-full h-full border-2 border-dashed border-white/60 rounded-[1.4rem] p-4 flex flex-col justify-between items-center bg-gradient-to-b from-amber-500 to-orange-600 text-white">
                    <span className="text-xs font-black tracking-widest">PUKA MISKI</span>
                    <div className="text-center">
                      <span className="text-5xl block mb-2">🎁</span>
                      <p className="font-black text-sm tracking-wide">SOBRE ANDINO</p>
                      <p className="text-[10px] text-white/80 font-bold">3 CARTAS DENTRO</p>
                    </div>
                    <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded-full">
                      50 ⭐ PUNTOS
                    </span>
                  </div>
                </div>

                <button
                  onClick={simulateOpenPack}
                  disabled={isOpeningPack}
                  className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-8 py-3.5 rounded-2xl shadow-xl shadow-orange-500/30 transition transform active:scale-95 flex items-center gap-2"
                >
                  {isOpeningPack ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" /> Abriendo Sobre Mágico...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" /> ¡Abrir Sobre Ahora!
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Vista de las 3 cartas reveladas */}
            {packOpened && (
              <div className="py-6 space-y-6">
                <p className="text-emerald-400 font-bold text-sm animate-pulse">
                  ✨ ¡Cartas descubiertas! Añadidas a tu colección:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {packCards.map((card, idx) => {
                    const badge = RARITY_BADGES[card.rarity] || RARITY_BADGES.COMMON;
                    const catIcon = CATEGORY_ICONS[card.category] || '✨';

                    return (
                      <div
                        key={idx}
                        className={`bg-gray-800 rounded-2xl border-2 ${badge.border} p-3 text-left shadow-xl ${badge.glow} transform animate-fade-in`}
                        style={{ animationDelay: `${idx * 150}ms` }}
                      >
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[9px] font-black text-gray-400">{card.code || 'PUKA'}</span>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${badge.bg}`}>
                            {badge.label}
                          </span>
                        </div>
                        <div className={`w-full aspect-[4/3] rounded-xl bg-gradient-to-br ${badge.color} flex flex-col items-center justify-center text-white mb-2 shadow`}>
                          <span className="text-3xl drop-shadow">{catIcon}</span>
                          <span className="text-[9px] font-black uppercase mt-1">{card.category}</span>
                        </div>
                        <h5 className="font-black text-white text-xs truncate">{card.name}</h5>
                        <p className="text-[10px] text-gray-300 line-clamp-2 mt-1 leading-snug">
                          {card.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => { setPackOpened(false); setPackCards([]); }}
                    className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl transition"
                  >
                    Cerrar Sobre
                  </button>
                  <button
                    onClick={simulateOpenPack}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs rounded-xl shadow-lg shadow-orange-500/25 transition"
                  >
                    🎲 Abrir Otro Sobre
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Crear Carta */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setIsCreateOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-gray-800">Nueva Puka Card</h3>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Agrega una carta de superalimento o valor al catálogo oficial.
            </p>

            <form onSubmit={handleCreate} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre de la Carta</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Kiwicha Dorada, Hierro Puro, Cañihua"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-puka-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-puka-red"
                  >
                    <option value="NATURALEZA">🌱 Naturaleza</option>
                    <option value="VALORES">🤝 Valores</option>
                    <option value="CONOCIMIENTOS">🏛️ Conocimientos</option>
                    <option value="HABILIDADES">⚡ Habilidades</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Rareza</label>
                  <select
                    value={formData.rarity}
                    onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-puka-red"
                  >
                    <option value="COMMON">🟢 Común (70%)</option>
                    <option value="RARE">🔵 Rara (20%)</option>
                    <option value="EPIC">🟣 Épica (9%)</option>
                    <option value="LEGENDARY">🟡 Legendaria (1%)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Descripción Educativa / Nutricional</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Ej: Supercereal andino con alto contenido de hierro y fósforo que combate la fatiga y fortalece el crecimiento."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-puka-red"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-puka-red text-white font-black text-xs rounded-xl shadow-lg shadow-puka-red/25 hover:bg-puka-red/90"
                >
                  Guardar Carta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
