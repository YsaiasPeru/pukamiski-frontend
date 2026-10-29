import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Sparkles, QrCode, Share2, 
  CheckCircle, Users, Trophy, HandHeart, Copy, ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ImpactoSocial() {
  const navigate = useNavigate();
  const [copiedYape, setCopiedYape] = useState(false);
  const [copiedPlin, setCopiedPlin] = useState(false);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'yape') {
      setCopiedYape(true);
      setTimeout(() => setCopiedYape(false), 2000);
    } else {
      setCopiedPlin(true);
      setTimeout(() => setCopiedPlin(false), 2000);
    }
  };

  const handleCelebrate = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-amber-50 to-orange-50 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-b-3xl shadow-sm flex items-center justify-between sticky top-0 z-20 border-b border-rose-100">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-full transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-rose-600">Sostenibilidad & Comunidad</span>
            <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
              Impacto Social <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            </h1>
          </div>
        </div>

        <button 
          onClick={handleCelebrate}
          className="p-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-2xl transition"
          title="Celebrar"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      </header>

      <main className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">

        {/* HERO BANNER: ALIMENTA UNA SONRISA */}
        <div className="bg-gradient-to-br from-rose-600 via-red-600 to-amber-600 rounded-[2.5rem] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="relative z-10">
            <span className="inline-block bg-white/20 backdrop-blur-sm text-yellow-200 text-xs font-black px-3 py-1 rounded-full mb-3">
              ❤️ Programa Oficial Pukamisky
            </span>
            <h2 className="text-3xl font-black leading-tight mb-2">
              Alimenta una Sonrisa
            </h2>
            <p className="text-rose-100 text-xs sm:text-sm font-medium leading-relaxed mb-6">
              Por cada <strong>5 cajas de cereal Pukamisky</strong> adquiridas, destinamos raciones enriquecidas con sangrecita y nutrientes andinos a niños en situación de vulnerabilidad para erradicar la anemia infantil.
            </p>

            {/* Contador de Impacto */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-rose-100 uppercase tracking-wide">Raciones Entregadas</span>
                <span className="text-2xl font-black text-yellow-300">340 / 500</span>
              </div>
              
              {/* Barra de Progreso */}
              <div className="w-full bg-black/20 rounded-full h-3.5 p-0.5 overflow-hidden mb-2">
                <div 
                  className="bg-gradient-to-r from-yellow-300 to-amber-400 h-full rounded-full transition-all duration-1000 shadow"
                  style={{ width: '68%' }}
                ></div>
              </div>

              <p className="text-[11px] text-right text-rose-100 font-bold">
                ¡Faltan 160 raciones para alcanzar la meta de la feria! 🎯
              </p>
            </div>
          </div>
        </div>

        {/* PILARES DEL PROGRAMA */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-rose-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-2xl mb-2">
              🩸
            </div>
            <h3 className="font-black text-gray-800 text-sm mb-1">Cero Anemia</h3>
            <p className="text-[11px] text-gray-500 font-medium">Nutrición con sangrecita deshidratada de alto hierro hemínico.</p>
          </div>

          <div className="bg-white p-4 rounded-3xl shadow-sm border border-rose-100 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center text-2xl mb-2">
              🌾
            </div>
            <h3 className="font-black text-gray-800 text-sm mb-1">Granos Andinos</h3>
            <p className="text-[11px] text-gray-500 font-medium">Comercio justo con agricultores de quinua, kiwicha y cañihua.</p>
          </div>
        </div>

        {/* SECCIÓN: APOYO AL EMPRENDIMIENTO */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-md border-2 border-amber-200/80">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
              <HandHeart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">¡Suma tu granito de arena!</span>
              <h3 className="text-lg font-black text-gray-800">Apoyo al Emprendimiento</h3>
            </div>
          </div>

          <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed mb-5">
            Somos un emprendimiento peruano enfocado en la salud y el futuro de nuestra niñez. Tu aporte voluntario nos permite seguir produciendo, investigando y llevando nutrición a más colegios y hogares.
          </p>

          {/* Tarjetas de Aporte Voluntario YAPE / PLIN */}
          <div className="space-y-3">
            {/* YAPE */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 text-white font-black rounded-xl flex items-center justify-center text-xs shadow">
                  YAPE
                </div>
                <div>
                  <h4 className="font-black text-gray-800 text-sm">Aporte vía Yape</h4>
                  <p className="text-xs font-mono text-gray-600 font-bold">987 654 321</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Titular: Proyecto Pukamisky</p>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard('987654321', 'yape')}
                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5"
              >
                {copiedYape ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedYape ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            {/* PLIN */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500 text-white font-black rounded-xl flex items-center justify-center text-xs shadow">
                  PLIN
                </div>
                <div>
                  <h4 className="font-black text-gray-800 text-sm">Aporte vía Plin</h4>
                  <p className="text-xs font-mono text-gray-600 font-bold">987 654 321</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Cualquier banco afiliado</p>
                </div>
              </div>
              <button 
                onClick={() => copyToClipboard('987654321', 'plin')}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5"
              >
                {copiedPlin ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPlin ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Información para Inversionistas / Alianzas de la Feria */}
          <div className="mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200/70 text-center">
            <h4 className="font-black text-amber-900 text-xs mb-1">
              💼 ¿Interesado en alianzas o patrocinio para la feria?
            </h4>
            <p className="text-amber-800 text-[11px] font-medium mb-3">
              Acércate a nuestro stand oficial o escríbenos a nuestro canal institucional.
            </p>
            <a 
              href="mailto:contacto@pukamiski.com"
              className="inline-flex items-center gap-1.5 text-xs font-black text-amber-800 bg-white px-4 py-2 rounded-xl shadow-sm border border-amber-200 hover:bg-amber-100 transition"
            >
              <span>contacto@pukamiski.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
