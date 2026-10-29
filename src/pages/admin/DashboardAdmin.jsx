import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, Target, Gamepad2, Gift, Users, 
  LogOut, Menu, X, TrendingUp, Activity, Plus, Edit, Trash2,
  QrCode, Download, Printer, ExternalLink, Check, Copy
} from 'lucide-react';
import api from '../../services/api';
import PukaCardsVista from './PukaCardsVista';
import RecompensasVista from './RecompensasVista';

const MetricasVista = () => {
  const [metrics, setMetrics] = useState({
    aventureros_activos: 0,
    puntos_generados: 0,
    retos_completados: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const { data } = await api.get('/admin/metrics');
        setMetrics(data);
      } catch (error) {
        console.error("Error al cargar métricas", error);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Visión Global</h2>
          <p className="text-gray-500 font-semibold mt-1">Así va el universo Puka Miski hoy.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/70 backdrop-blur-lg border border-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-puka-red/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-puka-red/20"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-gray-500 font-bold mb-1">Aventureros Activos</p>
              <h3 className="text-5xl font-black text-gray-800">{metrics.aventureros_activos}</h3>
            </div>
            <div className="w-14 h-14 bg-puka-red text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Users className="w-7 h-7" />
            </div>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-lg border border-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-orange-500/20"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-gray-500 font-bold mb-1">Puntos Generados</p>
              <h3 className="text-5xl font-black text-gray-800">{metrics.puntos_generados}</h3>
            </div>
            <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Activity className="w-7 h-7" />
            </div>
          </div>
        </div>
        <div className="bg-white/70 backdrop-blur-lg border border-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 relative overflow-hidden group hover:-translate-y-1 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-green-500/20"></div>
          <div className="flex justify-between items-center relative z-10">
            <div>
              <p className="text-gray-500 font-bold mb-1">Retos Completados</p>
              <h3 className="text-5xl font-black text-gray-800">{metrics.retos_completados}</h3>
            </div>
            <div className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RetosVista = () => {
  const [retos, setRetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', points: 50, type: 'DAILY', is_active: true });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => { fetchRetos(); }, []);

  const fetchRetos = async () => {
    try {
      const { data } = await api.get('/challenges/');
      setRetos(data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/challenges/${editingId}`, formData);
      else await api.post('/challenges/', formData);
      setModalOpen(false);
      fetchRetos();
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("¿Seguro que deseas eliminar este reto?")) return;
    try {
      await api.delete(`/challenges/${id}`);
      fetchRetos();
    } catch (error) { console.error(error); }
  };

  const openEdit = (reto) => {
    setEditingId(reto.id);
    setFormData({ name: reto.name, description: reto.description || '', points: reto.points, type: reto.type, is_active: reto.is_active });
    setModalOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', points: 50, type: 'DAILY', is_active: true });
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Gestión de Retos</h2>
          <p className="text-gray-500 font-semibold mt-1">Administra las misiones diarias y semanales.</p>
        </div>
        <button onClick={openNew} className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition shadow-lg">
          <Plus className="w-5 h-5" /> Nuevo Reto
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-5 font-bold">Misión</th>
                <th className="p-5 font-bold">Tipo</th>
                <th className="p-5 font-bold">Puntos</th>
                <th className="p-5 font-bold">Estado</th>
                <th className="p-5 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan="5" className="p-5 text-center">Cargando retos...</td></tr> : retos.map(reto => (
                <tr key={reto.id} className="hover:bg-gray-50 transition">
                  <td className="p-5">
                    <div className="font-bold text-gray-800">{reto.name}</div>
                    <div className="text-sm text-gray-500">{reto.description}</div>
                  </td>
                  <td className="p-5"><span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">{reto.type}</span></td>
                  <td className="p-5 font-bold text-orange-500">+{reto.points} ⭐</td>
                  <td className="p-5"><span className={reto.is_active ? "bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold" : "bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-bold"}>{reto.is_active ? 'Activo' : 'Inactivo'}</span></td>
                  <td className="p-5 text-right flex justify-end gap-3">
                    <button onClick={() => openEdit(reto)} className="text-gray-400 hover:text-blue-500 transition"><Edit className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(reto.id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-black text-gray-800 mb-6">{editingId ? 'Editar Reto' : 'Crear Reto'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Descripción</label>
                <input type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 border rounded-xl" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-bold text-gray-700 mb-1">Puntos</label>
                  <input required type="number" value={formData.points} onChange={e => setFormData({...formData, points: parseInt(e.target.value)})} className="w-full p-3 border rounded-xl" />
                </div>
                <div className="flex-1">
                  <label className="block font-bold text-gray-700 mb-1">Tipo</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full p-3 border rounded-xl bg-white">
                    <option value="DAILY">Diario</option>
                    <option value="WEEKLY">Semanal</option>
                    <option value="SPECIAL">Especial</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancelar</button>
                <button type="submit" className="px-6 py-3 font-bold bg-puka-red text-white rounded-xl shadow-lg hover:bg-red-700">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const UsuariosVista = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'PARENT' });

  useEffect(() => { fetchUsuarios(); }, []);

  const fetchUsuarios = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsuarios(data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/users', formData);
      setModalOpen(false);
      fetchUsuarios();
    } catch (error) { alert("Error al crear usuario. Revisa el correo."); console.error(error); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("¿Eliminar usuario permanentemente?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsuarios();
    } catch (error) { alert(error.response?.data?.detail || "Error"); }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">Usuarios del Sistema</h2>
          <p className="text-gray-500 font-semibold mt-1">Padres, Niños y Administradores.</p>
        </div>
        <button onClick={() => { setFormData({ name: '', email: '', password: '', role: 'PARENT' }); setModalOpen(true); }} className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition shadow-lg">
          <Plus className="w-5 h-5" /> Crear Usuario
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                <th className="p-5 font-bold">Nombre</th>
                <th className="p-5 font-bold">Correo</th>
                <th className="p-5 font-bold">Rol</th>
                <th className="p-5 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? <tr><td colSpan="4" className="p-5 text-center">Cargando usuarios...</td></tr> : usuarios.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="p-5 font-bold text-gray-800">{u.name}</td>
                  <td className="p-5 text-gray-500">{u.email}</td>
                  <td className="p-5"><span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg text-xs font-bold">{u.role}</span></td>
                  <td className="p-5 text-right">
                    <button onClick={() => handleDelete(u.id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-black text-gray-800 mb-6">Crear Nuevo Usuario</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-3 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Correo Electrónico</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-3 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Contraseña</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full p-3 border rounded-xl" />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Rol</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full p-3 border rounded-xl bg-white">
                  <option value="PARENT">Padre (PARENT)</option>
                  <option value="ADMIN">Administrador (ADMIN)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl">Cancelar</button>
                <button type="submit" className="px-6 py-3 font-bold bg-puka-red text-white rounded-xl shadow-lg hover:bg-red-700">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const QrCatalogoVista = () => {
  const [baseUrl, setBaseUrl] = useState(window.location.origin);
  const [copiedLink, setCopiedLink] = useState(null);

  const qrEmpaqueUrl = `${baseUrl}/semilla-puka`;
  const qrImpactoUrl = `${baseUrl}/impacto-social`;
  const qrEncuestaUrl = `${baseUrl}/login`;

  const copyUrl = (url, key) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const downloadQrImage = (url, filename) => {
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&color=16-85-39&data=${encodeURIComponent(url)}`;
    const a = document.createElement('a');
    a.href = qrImageUrl;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-black text-gray-800 tracking-tight">Catálogo Oficial de Códigos QR</h2>
        <p className="text-gray-500 font-semibold mt-1">
          Descarga y gestiona los códigos QR para los empaques físicos del cereal y el stand de la feria.
        </p>
      </div>

      {/* Configuración de URL del Dominio */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-gray-800 text-sm">Dirección Web Destino (URL Base)</h4>
          <p className="text-xs text-gray-500 font-medium">
            Por defecto usa la URL local. Cuando suban a Vercel, pueden poner aquí su dominio (ej: https://pukamisky.vercel.app).
          </p>
        </div>
        <input 
          type="text" 
          value={baseUrl} 
          onChange={e => setBaseUrl(e.target.value)} 
          className="w-full md:w-80 p-3 border rounded-xl font-mono text-xs font-bold bg-gray-50 focus:bg-white focus:outline-none focus:border-puka-red"
          placeholder="http://localhost:5173"
        />
      </div>

      {/* QR PRINCIPAL DEL EMPAQUE: SEMILLA PUKA */}
      <div className="bg-gradient-to-br from-green-700 via-emerald-800 to-teal-900 rounded-[2.5rem] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3 max-w-xl text-center lg:text-left">
            <span className="inline-block bg-white/20 text-yellow-300 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              ⭐ QR Oficial de Empaque (Caja de Cereal)
            </span>
            <h3 className="text-2xl sm:text-3xl font-black">
              Experiencia "Semilla Puka"
            </h3>
            <p className="text-green-100 text-xs sm:text-sm font-medium leading-relaxed">
              Este es el código QR que va <strong>impreso en la caja del cereal</strong>. Al escanearlo, el estudiante entra directamente a la guía de siembra, datos de nutrición y a subir las fotos de evidencia de su maceta para ganar puntos.
            </p>
            <div className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start">
              <button 
                onClick={() => downloadQrImage(qrEmpaqueUrl, 'QR-Empaque-SemillaPuka.png')}
                className="px-5 py-3 bg-yellow-400 hover:bg-yellow-300 text-green-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition flex items-center gap-2 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Descargar QR para Imprenta (PNG)</span>
              </button>
              <button 
                onClick={() => copyUrl(qrEmpaqueUrl, 'empaque')}
                className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl transition flex items-center gap-2"
              >
                {copiedLink === 'empaque' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink === 'empaque' ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>
          </div>

          {/* Tarjeta Visual del QR */}
          <div className="bg-white p-5 rounded-3xl shadow-2xl text-center shrink-0 border-4 border-yellow-300/40">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=16-85-39&data=${encodeURIComponent(qrEmpaqueUrl)}`}
              alt="QR Empaque Semilla Puka"
              className="w-44 h-44 object-contain mx-auto mb-2"
            />
            <span className="text-[10px] font-mono font-bold text-gray-500 block truncate max-w-[180px]">
              {qrEmpaqueUrl}
            </span>
          </div>
        </div>
      </div>

      {/* CATÁLOGO DE QRS PARA EL STAND DE LA FERIA */}
      <div>
        <h3 className="text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
          <span>QRs para Afiches y Stand de la Feria</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR 1: Impacto Social y Donaciones */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-black uppercase text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                Stand / Solidario
              </span>
              <h4 className="font-black text-gray-800 text-base">Impacto Social "Alimenta una Sonrisa"</h4>
              <p className="text-xs text-gray-500 font-medium">
                Para carteles de mesa: muestra las donaciones contra la anemia y los números de Yape/Plin.
              </p>
              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => downloadQrImage(qrImpactoUrl, 'QR-Impacto-Social.png')}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar
                </button>
                <button 
                  onClick={() => copyUrl(qrImpactoUrl, 'impacto')}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
                >
                  {copiedLink === 'impacto' ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-rose-50 p-3 rounded-2xl border border-rose-100 text-center shrink-0">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=225-29-72&data=${encodeURIComponent(qrImpactoUrl)}`}
                alt="QR Impacto Social"
                className="w-24 h-24 object-contain mx-auto"
              />
            </div>
          </div>

          {/* QR 2: Encuesta Nutricional para Padres */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                Familias / Diagnóstico
              </span>
              <h4 className="font-black text-gray-800 text-base">Encuesta Nutricional para Padres</h4>
              <p className="text-xs text-gray-500 font-medium">
                Para que los padres en la feria escaneen, ingresen y hagan el test del semáforo nutricional de su hijo.
              </p>
              <div className="pt-2 flex gap-2">
                <button 
                  onClick={() => downloadQrImage(qrEncuestaUrl, 'QR-Encuesta-Familias.png')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar
                </button>
                <button 
                  onClick={() => copyUrl(qrEncuestaUrl, 'encuesta')}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition"
                >
                  {copiedLink === 'encuesta' ? '¡Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 text-center shrink-0">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=37-99-235&data=${encodeURIComponent(qrEncuestaUrl)}`}
                alt="QR Encuesta Nutricional"
                className="w-24 h-24 object-contain mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardAdmin() {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('metricas');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'metricas', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'qr_catalog', label: 'Catálogo de QRs', icon: QrCode },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'retos', label: 'Retos Puka', icon: Target },
    { id: 'cartas', label: 'Puka Cards', icon: Gamepad2 },
    { id: 'recompensas', label: 'Recompensas', icon: Gift },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col md:flex-row font-sans">
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="text-xl font-black tracking-widest text-puka-red">PUKA ADMIN</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 bg-gray-800 rounded-lg">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
        fixed md:sticky top-0 left-0 h-screen w-72 bg-gray-900 text-gray-300 transition-transform duration-300 z-40
        flex flex-col border-r border-gray-800 shadow-2xl md:shadow-none
      `}>
        <div className="p-8 hidden md:block">
          <h1 className="text-2xl font-black tracking-widest text-white">PUKA <span className="text-puka-red">ADMIN</span></h1>
          <p className="text-xs text-gray-500 font-bold tracking-widest mt-1">DIRECTOR DEL JUEGO</p>
        </div>

        <nav className="flex-1 px-4 py-8 md:py-0 space-y-2">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                activeTab === item.id ? 'bg-puka-red text-white shadow-lg shadow-puka-red/20' : 'hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto mb-4">
          <div className="bg-gray-800 p-4 rounded-3xl flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center font-bold text-white">A</div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user?.name || 'Administrador'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="p-2 text-gray-400 hover:text-puka-red transition"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full">
        {activeTab === 'metricas' && <MetricasVista />}
        {activeTab === 'qr_catalog' && <QrCatalogoVista />}
        {activeTab === 'usuarios' && <UsuariosVista />}
        {activeTab === 'retos' && <RetosVista />}
        {activeTab === 'cartas' && <PukaCardsVista />}
        {activeTab === 'recompensas' && <RecompensasVista />}
      </main>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}
