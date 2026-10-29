import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Sprout, QrCode, Camera, CheckCircle2, 
  Sparkles, Sun, Droplets, BookOpen, Lightbulb, Bell, 
  Share2, Award, ChevronRight, X, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

// Función para redimensionar y comprimir fotos antes de procesarlas (evita Out of Memory / Memoria Llena en móviles)
const compressImage = (file, maxWidth = 1000, maxHeight = 1000, quality = 0.72) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('El archivo seleccionado no es una imagen válida.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo de la cámara'));
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Error al decodificar la imagen'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(readerEvent.target.result);
        }

        ctx.drawImage(img, 0, 0, width, height);

        try {
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        } catch (e) {
          resolve(readerEvent.target.result);
        }
      };
      img.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default function SemillaPuka() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [activeTab, setActiveTab] = useState('cultivador'); // 'cultivador' | 'guia' | 'curiosidades'
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingStage, setUploadingStage] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [reminderActive, setReminderActive] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Estados para inicio de sesión rápido en caso de escanear desde el empaque sin sesión
  const [quickCode, setQuickCode] = useState('');
  const [quickPin, setQuickPin] = useState('');
  const [quickLoading, setQuickLoading] = useState(false);
  const [quickError, setQuickError] = useState('');

  // QR URL para que cualquiera la escanee en la feria
  const qrTargetUrl = `${window.location.origin}/semilla-puka`;

  useEffect(() => {
    if (user && user.role === 'CHILD') {
      fetchPlantData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchPlantData = async () => {
    try {
      const { data } = await api.get('/children/me/plant');
      setPlant(data);
    } catch (error) {
      console.error("Error al cargar datos del cultivo", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (e) => {
    e.preventDefault();
    setQuickLoading(true);
    setQuickError('');
    try {
      const { data } = await api.post('/auth/login/child', {
        access_code: quickCode.trim().toUpperCase(),
        pin: quickPin.trim()
      });
      localStorage.setItem('puka_token', data.access_token);
      window.location.reload();
    } catch (err) {
      setQuickError(err.response?.data?.detail || "Código de acceso o PIN incorrecto");
    } finally {
      setQuickLoading(false);
    }
  };

  const handleFileUpload = async (stage, event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    setUploadingStage(stage);
    try {
      // Comprimir foto en el navegador para evitar el error de "memoria llena"
      const compressedBase64 = await compressImage(file, 1000, 1000, 0.72);
      await submitPhoto(stage, compressedBase64);
    } catch (err) {
      console.error("Error al procesar la foto:", err);
      setToastMessage({
        type: 'error',
        text: 'La foto es muy pesada para la memoria del teléfono. Prueba seleccionando otra o eligiendo desde la galería.'
      });
      setUploadingStage(null);
    } finally {
      if (event.target) event.target.value = '';
    }
  };

  const submitPhoto = async (stage, photoData) => {
    if (!user || user.role !== 'CHILD') {
      setToastMessage({
        type: 'warning',
        text: '¡Debes iniciar sesión con tu cuenta de niño para registrar la foto y ganar tus ⭐ estrellas!'
      });
      return;
    }

    setUploadingStage(stage);
    try {
      const { data } = await api.post('/children/me/plant/photo', {
        stage: stage,
        photo_data: photoData
      });

      // Actualizar estado local
      setPlant(prev => ({
        ...prev,
        status: data.status,
        [`photo_${stage}`]: photoData
      }));

      // Lanzar confeti si ganó puntos
      if (data.points_earned > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      setToastMessage({
        type: 'success',
        text: data.msg
      });
    } catch (error) {
      setToastMessage({
        type: 'error',
        text: error.response?.data?.detail || "Error al subir la fotografía"
      });
    } finally {
      setUploadingStage(null);
    }
  };

  const curiosidades = [
    {
      icon: "🌾",
      title: "La Quinua: El Grano de Oro",
      text: "Cultivada desde hace más de 5,000 años por los Incas, contiene los 9 aminoácidos esenciales y es el combustible de los verdaderos guerreros Puka."
    },
    {
      icon: "🩸",
      title: "El Poder del Hierro vs. La Anemia",
      text: "El hierro transporta oxígeno a tu cerebro y músculos. ¡Al comer Pukamisky con sangrecita y cereales andinos, te vuelves invencible contra el cansancio!"
    },
    {
      icon: "🌱",
      title: "Tu Semilla Respira y Siente",
      text: "Cada semilla Puka tiene vida dormida en su interior. Con solo unas gotas de agua y luz solar, despierta para convertirse en una planta llena de nutrientes."
    },
    {
      icon: "💧",
      title: "Riego Inteligente",
      text: "Regar muy poco marchita tu planta, pero regar en exceso la ahoga. La clave es tocar la tierra: si está húmeda, ¡déjala disfrutar del sol!"
    }
  ];

  const pasosSiembra = [
    {
      paso: 1,
      titulo: "Prepara la Cuna de tu Semilla",
      desc: "Consigue una maceta pequeña o vaso reciclado con agujeros abajo. Llénalo con tierra suave y con buen abono.",
      icon: <Sprout className="w-8 h-8 text-amber-700" />,
      color: "bg-amber-100 text-amber-800 border-amber-200"
    },
    {
      paso: 2,
      titulo: "Siembra con Cariño",
      desc: "Haz un agujerito en la tierra con tu dedo (aprox. 2 cm de profundidad). Coloca tu Semilla Puka y tápala suavemente.",
      icon: <CheckCircle2 className="w-8 h-8 text-green-600" />,
      color: "bg-green-100 text-green-800 border-green-200"
    },
    {
      paso: 3,
      titulo: "El Primer Baño de Gotitas",
      desc: "Riega con un rociador o con tus manitas con mucho cuidado para no desenterrar la semilla. La tierra debe quedar húmeda.",
      icon: <Droplets className="w-8 h-8 text-blue-500" />,
      color: "bg-blue-100 text-blue-800 border-blue-200"
    },
    {
      paso: 4,
      titulo: "Luz Solar y Paciencia Mágica",
      desc: "Ubica tu macetita en una ventana donde reciba luz del sol pero no viento fuerte. ¡En pocos días verás asomar tu primer brote!",
      icon: <Sun className="w-8 h-8 text-yellow-500" />,
      color: "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-amber-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-b-3xl shadow-sm flex items-center justify-between sticky top-0 z-20 border-b border-green-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(user ? (user.role === 'CHILD' ? '/dashboard' : '/padre') : '/login')} 
            className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-puka-gold">Experiencia Oficial</span>
            <h1 className="text-xl font-black text-gray-800 flex items-center gap-1.5">
              Semilla Puka <span className="text-green-600">🌱</span>
            </h1>
          </div>
        </div>

        {/* Botón para ver QR del empaque */}
        <button 
          onClick={() => setShowQrModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-md hover:scale-105 active:scale-95 transition"
        >
          <QrCode className="w-4 h-4" />
          <span>Ver QR</span>
        </button>
      </header>

      <main className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">
        
        {/* Banner de Bienvenida */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-yellow-300 text-xs font-black px-3 py-1 rounded-full mb-3">
              ✨ Cuidado Ambiental & Nutrición
            </span>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2">
              ¡Dale Vida a tu Semilla Puka!
            </h2>
            <p className="text-green-100 text-sm font-medium mb-4">
              Cada caja de cereal Pukamisky incluye una semilla viva. ¡Plántala, cuídala, sube tus fotos y gana estrellas mágicas para tus Ligas Puka!
            </p>

            {/* Notification reminder trigger */}
            <div className="flex items-center justify-between bg-black/15 backdrop-blur-sm p-3 rounded-2xl border border-white/15">
              <div className="flex items-center gap-2.5">
                <Bell className={`w-5 h-5 ${reminderActive ? 'text-yellow-300 animate-bounce' : 'text-green-200'}`} />
                <span className="text-xs font-bold text-white">Recordatorio de Riego diario</span>
              </div>
              <button 
                onClick={() => {
                  setReminderActive(!reminderActive);
                  setToastMessage({
                    type: 'success',
                    text: !reminderActive ? '🔔 ¡Recordatorio activado! Regarás tu semilla cada mañana a las 8:00 AM.' : 'Recordatorio desactivado.'
                  });
                }}
                className={`text-xs font-black px-3 py-1.5 rounded-xl transition ${
                  reminderActive ? 'bg-yellow-400 text-green-950 shadow' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {reminderActive ? 'Activado ✅' : 'Activar'}
              </button>
            </div>
          </div>
        </div>

        {/* IDENTIFICACIÓN DEL ESTUDIANTE / LOGIN RÁPIDO VÍA QR */}
        {!user ? (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-5 text-white shadow-lg border-2 border-yellow-300 animate-slide-up">
            <div className="flex items-center gap-2 mb-2 font-black text-sm sm:text-base">
              <Sparkles className="w-5 h-5 text-yellow-200 shrink-0" />
              <span>¿Escaneaste el QR de tu empaque? ¡Conecta tu cuenta!</span>
            </div>
            <p className="text-xs text-amber-100 font-medium mb-4">
              Ingresa tu Código Secreto de Niño para que tus fotos y tus <strong>+30 ⭐ por etapa</strong> se guarden en tu propio perfil y subas en las Ligas Puka.
            </p>

            <form onSubmit={handleQuickLogin} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="text" 
                  placeholder="CÓDIGO (Ej: JULIETA-F602)"
                  value={quickCode}
                  onChange={e => setQuickCode(e.target.value.toUpperCase())}
                  className="flex-1 p-3 bg-white text-gray-800 rounded-xl text-xs font-mono font-bold uppercase tracking-wider focus:outline-none shadow-inner"
                  required
                />
                <input 
                  type="password" 
                  placeholder="PIN (1234)"
                  maxLength="4"
                  value={quickPin}
                  onChange={e => setQuickPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full sm:w-28 p-3 bg-white text-gray-800 rounded-xl text-xs font-mono font-bold text-center focus:outline-none shadow-inner"
                  required
                />
              </div>

              {quickError && (
                <p className="text-xs text-red-100 bg-red-600/60 p-2 rounded-lg font-bold">
                  {quickError}
                </p>
              )}

              <button 
                type="submit" 
                disabled={quickLoading}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 text-amber-950 font-black text-xs sm:text-sm rounded-xl shadow transition active:scale-95"
              >
                {quickLoading ? 'Conectando...' : 'Conectar mi Cuenta y Subir Evidencia 🚀'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">🎒</span>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 block">Cuenta Conectada</span>
                <span className="font-black text-xs sm:text-sm">Aventurero: {user?.name}</span>
              </div>
            </div>
            <span className="text-xs font-bold bg-white text-emerald-800 px-2.5 py-1 rounded-xl shadow-sm">
              Evidencia Activa ✅
            </span>
          </div>
        )}

        {/* Selector de Pestañas */}
        <div className="flex bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-green-100">
          <button 
            onClick={() => setActiveTab('cultivador')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'cultivador' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-green-700'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Mis Fotos</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('guia')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'guia' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-green-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Guía de Siembra</span>
          </button>

          <button 
            onClick={() => setActiveTab('curiosidades')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'curiosidades' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'text-gray-500 hover:text-green-700'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Datos Curiosos</span>
          </button>
        </div>

        {/* TAB 1: CULTIVADOR DE NUTRICIÓN (FOTOS EN 3 ETAPAS) */}
        {activeTab === 'cultivador' && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Cultivador de Nutrición
                </h3>
                <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full">
                  +30 ⭐ por foto
                </span>
              </div>
              <p className="text-gray-500 text-xs font-semibold mb-5">
                Registra fotográficamente las 3 etapas del crecimiento de tu semilla. Al completar las 3, ¡recibirás la medalla de <strong className="text-green-700">Guardián Ambiental</strong>!
              </p>

              {/* Etapa 1: Siembra */}
              <StagePhotoCard 
                stageKey="siembra"
                stageTitle="Etapa 1: La Siembra"
                stageEmoji="🌱"
                stageDesc="Toma foto a tu semilla recién colocada en la tierra húmeda."
                photoUrl={plant?.photo_siembra}
                isUploading={uploadingStage === 'siembra'}
                onFileSelected={(e) => handleFileUpload('siembra', e)}
              />

              {/* Etapa 2: Desarrollo */}
              <StagePhotoCard 
                stageKey="crecimiento"
                stageTitle="Etapa 2: Desarrollo y Brote"
                stageEmoji="🌿"
                stageDesc="Toma foto cuando tu plantita comience a asomar sus primeras hojitas verdes."
                photoUrl={plant?.photo_crecimiento}
                isUploading={uploadingStage === 'crecimiento'}
                onFileSelected={(e) => handleFileUpload('crecimiento', e)}
              />

              {/* Etapa 3: Resultado Final */}
              <StagePhotoCard 
                stageKey="cosecha"
                stageTitle="Etapa 3: Resultado Final"
                stageEmoji="🍎"
                stageDesc="Toma foto de tu planta crecida y fuerte. ¡Misión cumplida!"
                photoUrl={plant?.photo_cosecha}
                isUploading={uploadingStage === 'cosecha'}
                onFileSelected={(e) => handleFileUpload('cosecha', e)}
              />
            </div>

            {/* Acceso a la Mascota Virtual */}
            <div 
              onClick={() => navigate('/mi-cultivo')}
              className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-5 text-white shadow-md flex items-center justify-between cursor-pointer hover:scale-[1.02] transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
                  🪴
                </div>
                <div>
                  <h4 className="font-black text-base">¿Quieres regarla virtualmente?</h4>
                  <p className="text-amber-100 text-xs font-medium">Entra a "Mi Cultivo" y riega tu planta mágica</p>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-white/80" />
            </div>
          </div>
        )}

        {/* TAB 2: GUÍA PASO A PASO */}
        {activeTab === 'guia' && (
          <div className="space-y-4 animate-fade-in">
            {pasosSiembra.map((p) => (
              <div 
                key={p.paso} 
                className={`bg-white rounded-3xl p-5 shadow-sm border-2 ${p.color} transition hover:shadow-md`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-white shadow-sm shrink-0">
                    {p.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                        Paso {p.paso}
                      </span>
                      <h4 className="font-black text-gray-800 text-base">{p.titulo}</h4>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: DATOS CURIOSOS */}
        {activeTab === 'curiosidades' && (
          <div className="grid grid-cols-1 gap-4 animate-fade-in">
            {curiosidades.map((c, idx) => (
              <div key={idx} className="bg-white rounded-3xl p-5 shadow-sm border border-green-100 hover:border-green-300 transition">
                <div className="flex items-start gap-3.5">
                  <span className="text-3xl p-2 bg-green-50 rounded-2xl shrink-0">{c.icon}</span>
                  <div>
                    <h4 className="font-black text-gray-800 text-base mb-1.5">{c.title}</h4>
                    <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">
                      {c.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* MODAL PARA VER EL CÓDIGO QR DEL EMPAQUE */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] p-6 max-w-sm w-full text-center shadow-2xl relative animate-slide-up border-4 border-green-100">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-gray-800 mb-1">Código QR del Empaque</h3>
            <p className="text-gray-500 text-xs font-semibold mb-5">
              Este es el código QR que se imprime en la caja de cereal Pukamisky. ¡Pruébalo escaneándolo con la cámara de tu celular!
            </p>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-3xl shadow-inner inline-block mb-4">
              <div className="bg-white p-3 rounded-2xl shadow-md">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=16-85-39&data=${encodeURIComponent(qrTargetUrl)}`}
                  alt="QR Semilla Puka"
                  className="w-44 h-44 object-contain mx-auto"
                />
              </div>
            </div>

            <div className="text-xs font-mono font-bold text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100 mb-4 break-all">
              {qrTargetUrl}
            </div>

            <button 
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-green-600 text-white font-black text-sm rounded-2xl hover:bg-green-700 transition"
            >
              ¡Entendido, genial!
            </button>
          </div>
        </div>
      )}

      {/* TOAST FLOTANTE */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[90%] animate-slide-up">
          <div className={`p-4 rounded-2xl shadow-xl flex items-center gap-3 text-white font-bold text-sm ${
            toastMessage.type === 'error' ? 'bg-red-500' : (toastMessage.type === 'warning' ? 'bg-amber-600' : 'bg-green-600')
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

// Subcomponente para cada etapa de fotografía
function StagePhotoCard({ stageKey, stageTitle, stageEmoji, stageDesc, photoUrl, isUploading, onFileSelected }) {
  const fileInputRef = React.useRef(null);

  return (
    <div className="p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 hover:border-green-200 transition mb-3">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{stageEmoji}</span>
          <div>
            <h4 className="font-bold text-gray-800 text-sm">{stageTitle}</h4>
            <p className="text-gray-500 text-xs font-medium">{stageDesc}</p>
          </div>
        </div>
        {photoUrl ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-black bg-green-100 text-green-700 px-2.5 py-1 rounded-full shrink-0 shadow-sm border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Evidencia Validada (+30 ⭐)
          </span>
        ) : (
          <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full shrink-0 border border-amber-200">
            Evidencia Pendiente
          </span>
        )}
      </div>

      {/* Preview de la foto o Botón de subida */}
      {photoUrl ? (
        <div className="relative mt-3 rounded-2xl overflow-hidden border-2 border-green-300 shadow-sm group">
          <img 
            src={photoUrl} 
            alt={stageTitle} 
            className="w-full h-44 object-cover" 
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-gray-800 font-bold text-xs px-3.5 py-2 rounded-xl shadow"
            >
              Cambiar Evidencia Fotográfica
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-md rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Camera className="w-4 h-4" />
            <span>{isUploading ? 'Subiendo evidencia...' : 'Tomar / Subir Foto de mi Planta (+30 ⭐)'}</span>
          </button>
        </div>
      )}

      {/* Input oculto de archivo (sin capture="environment" forzado para evitar colapsar la RAM del teléfono) */}
      <input 
        type="file" 
        accept="image/*" 
        ref={fileInputRef} 
        onChange={onFileSelected} 
        className="hidden" 
      />
    </div>
  );
}
