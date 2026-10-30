import React, { useState, useEffect } from 'react';
import { 
  Smartphone, CheckCircle2, Copy, Save, Sparkles, 
  ExternalLink, RefreshCw, AlertCircle, Phone, ArrowRight, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';

export default function DonacionesVista() {
  const [formData, setFormData] = useState({
    yape_phone: '987 654 321',
    yape_holder: 'Proyecto Pukamisky',
    plin_phone: '987 654 321',
    plin_holder: 'Proyecto Pukamisky'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedYape, setCopiedYape] = useState(false);
  const [copiedPlin, setCopiedPlin] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/settings/payments');
      if (data) {
        setFormData({
          yape_phone: data.yape_phone || '987 654 321',
          yape_holder: data.yape_holder || 'Proyecto Pukamisky',
          plin_phone: data.plin_phone || '987 654 321',
          plin_holder: data.plin_holder || 'Proyecto Pukamisky'
        });
      }
    } catch (error) {
      console.error("Error al cargar configuración de pagos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setToastMessage(null);

    try {
      await api.put('/admin/settings/payments', formData);
      setToastMessage({
        type: 'success',
        text: '¡Números de Yape y Plin actualizados correctamente en toda la plataforma!'
      });

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (error) {
      console.error("Error al guardar configuración de pagos", error);
      setToastMessage({
        type: 'error',
        text: error.response?.data?.detail || 'Error al guardar la configuración'
      });
    } finally {
      setSaving(false);
    }
  };

  const copyYapeToPlin = () => {
    setFormData(prev => ({
      ...prev,
      plin_phone: prev.yape_phone,
      plin_holder: prev.yape_holder
    }));
  };

  const handlePreviewCopy = (text, type) => {
    const cleanNumber = text.replace(/\s+/g, '');
    navigator.clipboard.writeText(cleanNumber);
    if (type === 'yape') {
      setCopiedYape(true);
      setTimeout(() => setCopiedYape(false), 2000);
    } else {
      setCopiedPlin(true);
      setTimeout(() => setCopiedPlin(false), 2000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
            Aportes & Donaciones Stand
          </span>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight mt-1 flex items-center gap-3">
            Configuración de Yape & Plin <span className="text-2xl">📱</span>
          </h2>
          <p className="text-gray-500 font-semibold text-sm">
            Modifica el número telefónico y titular que se muestra al público para recibir aportes en la feria.
          </p>
        </div>

        <a
          href="/impacto-social"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold px-4 py-3 rounded-2xl border border-gray-200 shadow-sm transition text-xs md:text-sm active:scale-95 self-start md:self-auto"
        >
          <ExternalLink className="w-4 h-4 text-purple-600" />
          <span>Ver Pantalla Pública</span>
        </a>
      </div>

      {/* Toast Notificación */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-bold shadow-md animate-fade-in ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
          <RefreshCw className="w-8 h-8 text-puka-red animate-spin mx-auto mb-2" />
          <p className="text-gray-500 font-bold text-sm">Cargando configuración de pagos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Formulario de Configuración (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-gray-800 text-lg">Cuentas Receptoras</h3>
                  <p className="text-xs text-gray-500 font-medium">Actualización en tiempo real para todos los visitantes</p>
                </div>
              </div>

              <button
                type="button"
                onClick={copyYapeToPlin}
                className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-xl transition"
                title="Copia el número y titular de Yape a Plin"
              >
                <Sparkles className="w-3.5 h-3.5" /> Mismo número para ambos
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Sección YAPE */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50/70 to-indigo-50/70 border border-purple-100 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 bg-purple-600 text-white font-black rounded-lg flex items-center justify-center text-[10px] shadow">
                    YAPE
                  </span>
                  <h4 className="font-black text-gray-800 text-sm">Configuración de Yape</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-purple-600" /> Número de Teléfono
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 987 654 321"
                      value={formData.yape_phone}
                      onChange={(e) => setFormData({ ...formData, yape_phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-mono font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nombre del Titular
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Proyecto Pukamisky o Tu Nombre"
                      value={formData.yape_holder}
                      onChange={(e) => setFormData({ ...formData, yape_holder: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sección PLIN */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50/70 to-blue-50/70 border border-cyan-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-cyan-500 text-white font-black rounded-lg flex items-center justify-center text-[10px] shadow">
                      PLIN
                    </span>
                    <h4 className="font-black text-gray-800 text-sm">Configuración de Plin</h4>
                  </div>

                  <button
                    type="button"
                    onClick={copyYapeToPlin}
                    className="sm:hidden text-[11px] font-bold text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-lg"
                  >
                    Usar de Yape
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-cyan-600" /> Número de Teléfono
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: 987 654 321"
                      value={formData.plin_phone}
                      onChange={(e) => setFormData({ ...formData, plin_phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-mono font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nombre del Titular / Banco
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Proyecto Pukamisky"
                      value={formData.plin_holder}
                      onChange={(e) => setFormData({ ...formData, plin_holder: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Botón Guardar */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-8 py-3.5 bg-puka-red hover:bg-puka-red/90 text-white font-black text-sm rounded-2xl shadow-xl shadow-puka-red/25 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Guardar y Aplicar en la Feria
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Vista Previa en Vivo (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                  Vista Previa en Vivo
                </span>
                <span className="text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Sincronizado
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-4 font-medium">
                Así es exactamente como las familias y jurados verán las opciones de pago en la sección de <strong className="text-gray-700">Impacto Social</strong>:
              </p>

              {/* Card Yape Preview */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex items-center justify-between mb-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 text-white font-black rounded-xl flex items-center justify-center text-xs shadow">
                    YAPE
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 text-sm">Aporte vía Yape</h4>
                    <p className="text-xs font-mono text-gray-700 font-black">{formData.yape_phone || '---'}</p>
                    <p className="text-[10px] text-gray-500 font-semibold truncate max-w-[150px]">
                      Titular: {formData.yape_holder || 'Proyecto Pukamisky'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreviewCopy(formData.yape_phone, 'yape')}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1"
                >
                  {copiedYape ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedYape ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Card Plin Preview */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-cyan-500 text-white font-black rounded-xl flex items-center justify-center text-xs shadow">
                    PLIN
                  </div>
                  <div>
                    <h4 className="font-black text-gray-800 text-sm">Aporte vía Plin</h4>
                    <p className="text-xs font-mono text-gray-700 font-black">{formData.plin_phone || '---'}</p>
                    <p className="text-[10px] text-gray-500 font-semibold truncate max-w-[150px]">
                      Titular: {formData.plin_holder || 'Proyecto Pukamisky'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handlePreviewCopy(formData.plin_phone, 'plin')}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1"
                >
                  {copiedPlin ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPlin ? '¡Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* Stand Tip */}
              <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  💡 Tip para el Stand de la Feria:
                </p>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Coloca el número de celular del miembro del equipo que tenga las notificaciones activas para confirmar al instante cuando un visitante haga un aporte.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
