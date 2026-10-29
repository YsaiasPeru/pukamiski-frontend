import React, { useState, useEffect } from 'react';
import { 
  Gift, Ticket, CheckCircle2, Clock, Plus, Copy, Check, 
  Sparkles, Package, Star, RefreshCw, X, ShieldCheck, Tag, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';

const DEFAULT_DEMO_REDEMPTIONS = [
  {
    id: 'demo-1',
    child_name: 'Julieta Quispe',
    access_code: 'JULIETA-F602',
    reward_title: 'Cupón 15% Descuento Stand Feria (PUKA-FERIA-15)',
    points: 120,
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    status: 'PENDING',
    type: 'FISICO'
  },
  {
    id: 'demo-2',
    child_name: 'Junior Flores',
    access_code: 'JUNIOR-NCF3',
    reward_title: 'Cereal Puka Miski Mini 100g Gratis (PUKA-CEREAL-MINI)',
    points: 250,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'PENDING',
    type: 'FISICO'
  },
  {
    id: 'demo-3',
    child_name: 'Mateo Condori',
    access_code: 'PUKA-19XY',
    reward_title: 'Pulsera Oficial Puka Miski (PUKA-PULSERA)',
    points: 80,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'DELIVERED',
    type: 'FISICO'
  },
  {
    id: 'demo-4',
    child_name: 'Luciana Ramos',
    access_code: 'PUKA-88LK',
    reward_title: 'Fondo de Pantalla HD Puka Guardián',
    points: 30,
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    status: 'DELIVERED',
    type: 'DIGITAL'
  }
];

const INITIAL_CATALOG = [
  {
    id: 'rew-1',
    name: 'Cupón 15% DCTO en Stand de Feria',
    code: 'PUKA-FERIA-15',
    category: 'FERIA / FISICO',
    points_required: 120,
    stock: 45,
    total_stock: 50,
    is_active: true,
    description: 'Válido para comprar cajas de cereal Puka Miski con descuento directo en el stand.'
  },
  {
    id: 'rew-2',
    name: 'Cereal Puka Miski Mini 100g Gratis',
    code: 'PUKA-CEREAL-MINI',
    category: 'FERIA / FISICO',
    points_required: 250,
    stock: 18,
    total_stock: 20,
    is_active: true,
    description: 'Premio estelar: muestra gratis de cereal andino fortificado con hierro.'
  },
  {
    id: 'rew-3',
    name: 'Pulsera Oficial Puka Miski',
    code: 'PUKA-PULSERA',
    category: 'MERCHANDISING',
    points_required: 80,
    stock: 27,
    total_stock: 30,
    is_active: true,
    description: 'Pulsera tejida con los colores de Puka Miski para campeones antianemia.'
  },
  {
    id: 'rew-4',
    name: 'Pack Stickers WhatsApp Héroes Puka',
    code: 'STICKERS-WHATSAPP',
    category: 'DIGITAL',
    points_required: 40,
    stock: 999,
    total_stock: 999,
    is_active: true,
    description: '12 stickers animados de Puka y los superalimentos para chatear con amigos.'
  },
  {
    id: 'rew-5',
    name: 'Wallpaper HD Puka Guardián del Sol',
    code: 'WALLPAPER-PUKA',
    category: 'DIGITAL',
    points_required: 30,
    stock: 999,
    total_stock: 999,
    is_active: true,
    description: 'Fondo de pantalla en alta resolución para celular o tablet.'
  }
];

export default function RecompensasVista() {
  const [activeSubTab, setActiveSubTab] = useState('canjes'); // 'canjes' | 'catalogo' | 'codigos'
  const [redemptions, setRedemptions] = useState([]);
  const [catalog, setCatalog] = useState(INITIAL_CATALOG);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PENDING' | 'DELIVERED'
  const [copiedCode, setCopiedCode] = useState(null);

  // Modal Nuevo Premio
  const [isNewRewardOpen, setIsNewRewardOpen] = useState(false);
  const [rewardForm, setRewardForm] = useState({
    name: '',
    code: '',
    category: 'FERIA / FISICO',
    points_required: 100,
    stock: 25,
    description: ''
  });

  // Códigos de feria activos
  const [promoCodes, setPromoCodes] = useState([
    { code: 'FERIA-STAND-2026', points: 50, desc: 'Regalo para nuevos visitantes que se registren en el stand.', uses: 14 },
    { code: 'JURADO-VIP-100', points: 100, desc: 'Código exclusivo para evaluación de jurados y profesores.', uses: 3 },
    { code: 'COLEGIO-ORO', points: 80, desc: 'Código para compañeros y profesores del colegio.', uses: 22 },
  ]);
  const [newPromoCode, setNewPromoCode] = useState({ code: '', points: 50, desc: '' });
  const [isPromoOpen, setIsPromoOpen] = useState(false);

  useEffect(() => {
    fetchRedemptions();
  }, []);

  const fetchRedemptions = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/redemptions');
      if (data && data.length > 0) {
        setRedemptions(data);
      } else {
        // Usar datos demo interactivos si aún no hay canjes reales en la BD
        setRedemptions(DEFAULT_DEMO_REDEMPTIONS);
      }
    } catch (error) {
      console.warn("Usando datos de respaldo para canjes", error);
      setRedemptions(DEFAULT_DEMO_REDEMPTIONS);
    } finally {
      setLoading(false);
    }
  };

  const markDelivered = async (id) => {
    try {
      await api.post(`/admin/redemptions/${id}/deliver`).catch(() => {});
      
      setRedemptions(prev => prev.map(item => 
        item.id === id ? { ...item, status: 'DELIVERED' } : item
      ));

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateReward = (e) => {
    e.preventDefault();
    const newReward = {
      id: 'rew-' + Date.now(),
      ...rewardForm,
      total_stock: rewardForm.stock,
      is_active: true
    };
    setCatalog([newReward, ...catalog]);
    setIsNewRewardOpen(false);
    setRewardForm({ name: '', code: '', category: 'FERIA / FISICO', points_required: 100, stock: 25, description: '' });
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleCreatePromoCode = (e) => {
    e.preventDefault();
    if (!newPromoCode.code) return;
    setPromoCodes([{ ...newPromoCode, uses: 0 }, ...promoCodes]);
    setIsPromoOpen(false);
    setNewPromoCode({ code: '', points: 50, desc: '' });
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredRedemptions = redemptions.filter(item => {
    if (filterStatus === 'ALL') return true;
    return item.status === filterStatus;
  });

  const pendingCount = redemptions.filter(r => r.status === 'PENDING').length;
  const deliveredCount = redemptions.filter(r => r.status === 'DELIVERED').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Feria Escolar / Stand en Vivo
          </span>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight mt-1 flex items-center gap-3">
            Gestor de Recompensas <span className="text-2xl">🎁</span>
          </h2>
          <p className="text-gray-500 font-semibold text-sm">
            Validación de premios en el stand, control de stock y códigos de bienvenida.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsPromoOpen(true)}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white font-black px-4 py-3 rounded-2xl shadow transition text-xs md:text-sm active:scale-95"
          >
            <Ticket className="w-4 h-4 text-amber-400" /> Generar Código Feria
          </button>
          <button
            onClick={() => setIsNewRewardOpen(true)}
            className="flex items-center gap-2 bg-puka-red hover:bg-puka-red/90 text-white font-black px-5 py-3 rounded-2xl shadow-lg shadow-puka-red/25 transition text-xs md:text-sm active:scale-95"
          >
            <Plus className="w-5 h-5" /> Nuevo Premio
          </button>
        </div>
      </div>

      {/* Selector de Sub-Pestañas */}
      <div className="flex gap-2 p-1.5 bg-gray-200/60 rounded-2xl max-w-md">
        <button
          onClick={() => setActiveSubTab('canjes')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeSubTab === 'canjes' ? 'bg-white text-puka-red shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Clock className="w-4 h-4" /> Bandeja Stand
          {pendingCount > 0 && (
            <span className="bg-puka-red text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('catalogo')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeSubTab === 'catalogo' ? 'bg-white text-puka-red shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" /> Catálogo & Stock ({catalog.length})
        </button>
        <button
          onClick={() => setActiveSubTab('codigos')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-2 ${
            activeSubTab === 'codigos' ? 'bg-white text-puka-red shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Ticket className="w-4 h-4" /> Códigos ({promoCodes.length})
        </button>
      </div>

      {/* SUB-PESTAÑA 1: BANDEJA DE CANJES EN STAND */}
      {activeSubTab === 'canjes' && (
        <div className="space-y-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 font-bold">Total Canjes</p>
                <p className="text-2xl font-black text-gray-800">{redemptions.length}</p>
              </div>
              <Gift className="w-8 h-8 text-puka-red" />
            </div>
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-amber-700 font-bold">Pendientes por Entregar</p>
                <p className="text-2xl font-black text-amber-800">{pendingCount}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-emerald-700 font-bold">Premios Entregados</p>
                <p className="text-2xl font-black text-emerald-800">{deliveredCount}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
          </div>

          {/* Filtros de estado */}
          <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-100">
            <span className="text-xs font-bold text-gray-500">Filtrar por estado:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filterStatus === 'ALL' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Todos ({redemptions.length})
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filterStatus === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                ⏳ Pendientes ({pendingCount})
              </button>
              <button
                onClick={() => setFilterStatus('DELIVERED')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${filterStatus === 'DELIVERED' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                ✅ Entregados ({deliveredCount})
              </button>
            </div>
          </div>

          {/* Tabla de Canjes */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/80 text-gray-400 font-bold text-xs uppercase border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-6">Aventurero / Código</th>
                    <th className="py-4 px-6">Premio Canjeado</th>
                    <th className="py-4 px-6">Puntos ⭐</th>
                    <th className="py-4 px-6">Estado</th>
                    <th className="py-4 px-6 text-right">Acción Stand</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredRedemptions.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition">
                      <td className="py-4 px-6">
                        <p className="font-black text-gray-800">{item.child_name}</p>
                        <span className="text-[11px] font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {item.access_code}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-700 text-xs md:text-sm">{item.reward_title}</p>
                        <span className="text-[10px] text-gray-400">
                          {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-black text-amber-600 flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {item.points} ⭐
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {item.status === 'DELIVERED' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Entregado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                            <Clock className="w-3 h-3 animate-spin" /> Pendiente Stand
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {item.status === 'PENDING' ? (
                          <button
                            onClick={() => markDelivered(item.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-95 inline-flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" /> Entregar Premio
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-gray-400">
                            Entregado con éxito
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-PESTAÑA 2: CATÁLOGO DE PREMIOS & STOCK */}
      {activeSubTab === 'catalogo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {catalog.map((reward) => (
            <div key={reward.id} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-puka-red bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                    {reward.category}
                  </span>
                  <span className="text-xs font-black text-amber-600 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {reward.points_required} ⭐
                  </span>
                </div>

                <h4 className="font-black text-gray-800 text-base mb-1">{reward.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{reward.description}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-gray-400 font-bold block text-[10px]">Stock Feria:</span>
                  <span className="font-black text-gray-700">
                    {reward.stock} / {reward.total_stock} disponibles
                  </span>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-black rounded-lg text-[10px] border border-emerald-100">
                  Activo en Tienda
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-PESTAÑA 3: CÓDIGOS PROMOCIONALES DE FERIA */}
      {activeSubTab === 'codigos' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-3xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Herramienta de Stand</span>
              <h3 className="text-xl font-black mt-1">Regala Puntos a los Visitantes y Jurados</h3>
              <p className="text-xs text-gray-300 mt-1 max-w-lg">
                Usa estos códigos para que los asistentes escaneen y reciban estrellas instantáneas al probar la plataforma en la feria.
              </p>
            </div>
            <button
              onClick={() => setIsPromoOpen(true)}
              className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-gray-900 font-black text-xs rounded-2xl shadow transition"
            >
              + Crear Nuevo Código
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {promoCodes.map((item, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-black text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> +{item.points} ⭐
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">
                      {item.uses} canjes realizados
                    </span>
                  </div>

                  <div className="bg-gray-50 border border-dashed border-gray-300 p-3 rounded-2xl flex items-center justify-between my-3">
                    <span className="font-mono font-black text-sm text-gray-800 tracking-wider">
                      {item.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(item.code, item.code)}
                      className="p-1.5 bg-white text-gray-700 hover:text-puka-red rounded-lg shadow-sm border border-gray-200 transition"
                      title="Copiar código"
                    >
                      {copiedCode === item.code ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100">
                  <span className="text-[10px] text-emerald-600 font-black uppercase bg-emerald-50 px-2 py-0.5 rounded">
                    Código Válido Feria 2026
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Nuevo Premio */}
      {isNewRewardOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setIsNewRewardOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-gray-800">Nuevo Premio para la Tienda</h3>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Configura un premio canjeable para los niños en la feria.
            </p>

            <form onSubmit={handleCreateReward} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Premio</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Gorra Puka Miski, Descuento 20%"
                  value={rewardForm.name}
                  onChange={(e) => setRewardForm({ ...rewardForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-puka-red"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                  <select
                    value={rewardForm.category}
                    onChange={(e) => setRewardForm({ ...rewardForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-puka-red"
                  >
                    <option value="FERIA / FISICO">Feria / Físico</option>
                    <option value="DIGITAL">Digital</option>
                    <option value="MERCHANDISING">Merchandising</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estrellas ⭐</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={rewardForm.points_required}
                    onChange={(e) => setRewardForm({ ...rewardForm, points_required: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-puka-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Stock Inicial de Feria</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={rewardForm.stock}
                  onChange={(e) => setRewardForm({ ...rewardForm, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-puka-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Descripción</label>
                <textarea
                  rows="2"
                  required
                  placeholder="Detalles sobre cómo reclamar este premio en el stand..."
                  value={rewardForm.description}
                  onChange={(e) => setRewardForm({ ...rewardForm, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-puka-red"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewRewardOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-puka-red text-white font-black text-xs rounded-xl shadow-lg shadow-puka-red/25 hover:bg-puka-red/90"
                >
                  Crear Premio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Crear Código de Feria */}
      {isPromoOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] max-w-md w-full p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setIsPromoOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-gray-800">Crear Código Promocional</h3>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Código especial para premiar con estrellas a visitantes del stand.
            </p>

            <form onSubmit={handleCreatePromoCode} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Código (en Mayúsculas)</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: STAND-AMIGO, COLEGIO-TOP"
                  value={newPromoCode.code}
                  onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono font-black focus:outline-none focus:ring-2 focus:ring-puka-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Estrellas de Regalo ⭐</label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  required
                  value={newPromoCode.points}
                  onChange={(e) => setNewPromoCode({ ...newPromoCode, points: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-puka-red"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Para quién es / Descripción</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Para jurados evaluadores de ciencias"
                  value={newPromoCode.desc}
                  onChange={(e) => setNewPromoCode({ ...newPromoCode, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-puka-red"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPromoOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-black text-xs rounded-xl shadow-lg transition"
                >
                  Guardar Código
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
