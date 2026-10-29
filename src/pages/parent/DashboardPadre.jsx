import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { 
  UserPlus, LogOut, Copy, Trash2, ClipboardCheck, 
  Heart, AlertTriangle, CheckCircle, HelpCircle, X, Sparkles, ChevronRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';

export default function DashboardPadre() {
  const { user, logout } = useContext(AuthContext);
  const [childrenList, setChildrenList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el modal de agregar hijo
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChildData, setNewChildData] = useState({ name: '', pin: '' });
  const [adding, setAdding] = useState(false);

  // Estado para Encuesta Nutricional
  const [surveyChild, setSurveyChild] = useState(null); // Niño seleccionado para la encuesta
  const [surveyAnswers, setSurveyAnswers] = useState({ q1: 2, q2: 2, q3: 2, q4: 2, q5: 2 });
  const [surveyResult, setSurveyResult] = useState(null);
  const [surveysHistory, setSurveysHistory] = useState({});

  useEffect(() => {
    fetchChildren();
    loadSurveysHistory();
  }, []);

  const loadSurveysHistory = () => {
    const saved = localStorage.getItem('puka_surveys_history');
    if (saved) {
      try { setSurveysHistory(JSON.parse(saved)); } catch (e) {}
    }
  };

  const fetchChildren = async () => {
    try {
      const { data } = await api.get('/parents/me/children');
      setChildrenList(data);
    } catch (error) {
      console.error("Error fetching children", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post('/parents/me/children', newChildData);
      setShowAddForm(false);
      setNewChildData({ name: '', pin: '' });
      fetchChildren();
    } catch (error) {
      console.error("Error al crear perfil infantil", error);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteChild = async (childId) => {
    if (!window.confirm("¿Seguro que deseas eliminar este perfil? Se perderán sus puntos y progreso.")) return;
    try {
      await api.delete(`/parents/me/children/${childId}`);
      fetchChildren();
    } catch (error) {
      alert("Error al eliminar el perfil");
      console.error(error);
    }
  };

  // Lógica de cálculo de la encuesta nutricional
  const handleCalculateSurvey = () => {
    const totalScore = Number(surveyAnswers.q1) + Number(surveyAnswers.q2) + Number(surveyAnswers.q3) + Number(surveyAnswers.q4) + Number(surveyAnswers.q5);

    let trafficLight = 'GREEN';
    let title = 'Nivel Nutricional Óptimo';
    let description = '¡Excelente! Tu hijo mantiene una alimentación rica en hierro y nutrientes. Con el cereal Pukamisky mantendrá sus niveles de hemoglobina al máximo.';
    let recommendations = [
      'Mantén el hábito diario de un desayuno nutritivo.',
      'Sigue fomentando el reto de los 30 días en la app.',
      'Acompaña siempre con frutas cítricas para fijar el hierro.'
    ];

    if (totalScore <= 8) {
      trafficLight = 'RED';
      title = 'Alerta: Riesgo Alto de Anemia';
      description = 'El consumo de alimentos con hierro hemínico es insuficiente. Es urgente reforzar su dieta para prevenir fatiga, bajo rendimiento escolar y bajas defensas.';
      recommendations = [
        'Incorpora Pukamisky con sangrecita a diario en sus meriendas.',
        'Incluye vísceras oscuras (sangrecita, bazo, hígado) al menos 3 veces por semana.',
        'Evita dar infusiones o té junto con las comidas principales.'
      ];
    } else if (totalScore <= 12) {
      trafficLight = 'YELLOW';
      title = 'Nivel Preventivo (Requiere Refuerzo)';
      description = 'Tiene hábitos regulares, pero existen áreas de oportunidad en la ingesta de cereales andinos y alimentos ricos en hierro para blindar su salud.';
      recommendations = [
        'Aumenta el consumo de cereales andinos (quinua, kiwicha).',
        'Motívalo a completar los retos diarios de nutrición en la plataforma.',
        'Asegura que tome al menos 4 vasos de agua pura al día.'
      ];
    }

    const resultData = {
      score: totalScore,
      trafficLight,
      title,
      description,
      recommendations,
      date: new Date().toLocaleDateString()
    };

    setSurveyResult(resultData);

    // Guardar en historial por niño
    if (surveyChild) {
      const updated = { ...surveysHistory, [surveyChild.id]: resultData };
      setSurveysHistory(updated);
      localStorage.setItem('puka_surveys_history', JSON.stringify(updated));
    }

    if (trafficLight === 'GREEN') {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <header className="bg-white px-6 sm:px-8 py-5 shadow-sm flex justify-between items-center border-b sticky top-0 z-20">
        <div>
          <span className="text-xs font-black text-puka-red tracking-wider uppercase">Pukamisky Familiar</span>
          <h1 className="text-xl sm:text-2xl font-black text-gray-800">Panel de Control para Padres</h1>
        </div>
        <div className="flex gap-4 sm:gap-6 text-gray-500 items-center">
          <a href="/impacto-social" className="text-xs font-bold text-rose-600 hover:underline hidden sm:block">
            Impacto Social ❤️
          </a>
          <button onClick={logout} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600 hover:text-puka-red">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-8 max-w-5xl mx-auto space-y-6">

        {/* HERO PADRE */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-xs font-bold text-puka-gold uppercase tracking-wider">¡Bienvenido!</span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">Hola, {user?.name || 'Padre de Familia'} 👋</h2>
            <p className="text-gray-300 text-xs sm:text-sm font-medium mt-1">
              Monitorea en tiempo real los hábitos, retos y la salud nutricional de tus pequeños.
            </p>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-puka-red text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition shadow-md shrink-0 active:scale-95"
          >
            <UserPlus className="w-4 h-4" /> Agregar Aventurero
          </button>
        </div>

        {/* MODAL / FORM AGREGAR HIJO */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 max-w-md mx-auto animate-slide-up">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Registrar Nuevo Aventurero</h3>
            <form onSubmit={handleAddChild} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-bold mb-1 text-xs">Nombre del Niño</label>
                <input 
                  type="text" 
                  value={newChildData.name}
                  onChange={e => setNewChildData({...newChildData, name: e.target.value})}
                  className="w-full p-3 border rounded-xl focus:border-puka-red focus:outline-none text-sm"
                  placeholder="Ej: Mateo"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-bold mb-1 text-xs">PIN de Acceso (4 dígitos)</label>
                <input 
                  type="text" 
                  maxLength="4"
                  value={newChildData.pin}
                  onChange={e => setNewChildData({...newChildData, pin: e.target.value.replace(/\D/g, '')})}
                  className="w-full p-3 border rounded-xl focus:border-puka-red focus:outline-none text-center text-xl tracking-widest font-mono font-bold"
                  placeholder="1234"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 text-gray-600 font-bold border rounded-xl text-xs hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={adding}
                  className="flex-1 py-3 bg-puka-red text-white font-bold rounded-xl text-xs shadow-md hover:bg-red-700 disabled:opacity-50"
                >
                  {adding ? 'Creando...' : 'Crear Perfil'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* LISTA DE NIÑOS */}
        <div>
          <h3 className="text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
            <span>Perfiles de tus Niños</span>
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full font-bold">
              {childrenList.length}
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="text-gray-500">Cargando perfiles...</div>
            ) : childrenList.length === 0 ? (
              <div className="col-span-full bg-yellow-50 p-8 rounded-3xl border border-yellow-200 text-center text-yellow-800">
                Aún no tienes héroes registrados. Haz clic en "Agregar Aventurero" para comenzar.
              </div>
            ) : (
              childrenList.map(child => {
                const childSurvey = surveysHistory[child.id];

                return (
                  <div key={child.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition relative flex flex-col justify-between">
                    <div>
                      {/* Cabecera del Niño */}
                      <div className="flex items-center gap-4 mb-4 relative">
                        <div className="w-14 h-14 bg-puka-red text-white rounded-2xl flex justify-center items-center text-2xl font-black shadow-inner shrink-0">
                          {child.name ? child.name[0].toUpperCase() : 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-black text-lg text-gray-800 truncate">{child.name || 'Sin nombre'}</h3>
                          <span className="text-xs font-bold text-puka-gold bg-yellow-50 px-2 py-0.5 rounded-md inline-block">
                            {child.level || 'Novato'}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleDeleteChild(child.id)}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
                          title="Eliminar perfil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Semáforo Nutricional si ya hizo la encuesta */}
                      {childSurvey ? (
                        <div className={`p-3 rounded-2xl mb-4 border flex items-center justify-between text-xs font-bold ${
                          childSurvey.trafficLight === 'GREEN' 
                            ? 'bg-green-50 text-green-800 border-green-200' 
                            : (childSurvey.trafficLight === 'YELLOW' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-red-50 text-red-800 border-red-200')
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="text-base">
                              {childSurvey.trafficLight === 'GREEN' ? '🟢' : (childSurvey.trafficLight === 'YELLOW' ? '🟡' : '🔴')}
                            </span>
                            <div>
                              <span className="block font-black">{childSurvey.title}</span>
                              <span className="text-[10px] opacity-80">Evaluado el {childSurvey.date}</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => {
                              setSurveyChild(child);
                              setSurveyResult(childSurvey);
                            }}
                            className="underline text-[11px] font-black"
                          >
                            Ver
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setSurveyChild(child);
                            setSurveyResult(null);
                          }}
                          className="w-full mb-4 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-black flex items-center justify-center gap-1.5 transition"
                        >
                          <ClipboardCheck className="w-4 h-4" />
                          <span>Hacer Encuesta Nutricional</span>
                        </button>
                      )}

                      {/* Métricas */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between items-center text-gray-600 bg-gray-50 p-2.5 rounded-xl text-xs">
                          <span className="font-semibold">Total de Puntos</span>
                          <span className="font-bold text-gray-800">{child.total_points} ⭐</span>
                        </div>
                        
                        <div className="flex justify-between items-center text-gray-600 bg-blue-50/70 p-2.5 rounded-xl text-xs">
                          <span className="font-semibold">Retos Completados</span>
                          <span className="font-bold text-blue-800">{child.challenges_completed || 0} 🎯</span>
                        </div>

                        <div className="flex justify-between items-center text-gray-600 bg-purple-50/70 p-2.5 rounded-xl text-xs">
                          <span className="font-semibold">Cartas Coleccionadas</span>
                          <span className="font-bold text-purple-800">{child.cards_collected || 0} / {child.total_cards || 40} 🃏</span>
                        </div>
                      </div>
                    </div>

                    {/* Código de Acceso */}
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-[10px] text-gray-400 mb-1 font-black uppercase">Código de Acceso del Niño</p>
                      <div className="flex justify-between items-center bg-gray-800 text-white p-2.5 rounded-xl">
                        <span className="font-mono tracking-wider font-bold text-xs">{child.access_code}</span>
                        <Copy className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" onClick={() => navigator.clipboard.writeText(child.access_code)} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </main>

      {/* MODAL DE ENCUESTA NUTRICIONAL INICIAL */}
      {surveyChild && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto border-4 border-emerald-100 animate-slide-up">
            <button 
              onClick={() => {
                setSurveyChild(null);
                setSurveyResult(null);
              }}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            {!surveyResult ? (
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <ClipboardCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-800">Encuesta Nutricional Inicial</h3>
                    <p className="text-xs text-gray-500 font-semibold">Evaluando hábitos de: <strong className="text-emerald-700">{surveyChild.name}</strong></p>
                  </div>
                </div>

                <p className="text-xs text-gray-500 mb-5 font-medium">
                  Responde estas 5 preguntas para evaluar la prevención de anemia y conocer el semáforo nutricional de tu hijo.
                </p>

                <div className="space-y-4">
                  {/* Pregunta 1: Hierro */}
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <label className="block text-xs font-black text-gray-800 mb-2">
                      1. ¿Con qué frecuencia consume alimentos ricos en hierro (sangrecita, bazo, hígado o lentejas)?
                    </label>
                    <select 
                      value={surveyAnswers.q1} 
                      onChange={e => setSurveyAnswers({...surveyAnswers, q1: e.target.value})}
                      className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="1">Rara vez o casi nunca</option>
                      <option value="2">1 a 2 veces por semana</option>
                      <option value="3">3 o más veces por semana (Excelente)</option>
                    </select>
                  </div>

                  {/* Pregunta 2: Frutas y Verduras */}
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <label className="block text-xs font-black text-gray-800 mb-2">
                      2. ¿Cuántas porciones de verduras o frutas frescas come al día?
                    </label>
                    <select 
                      value={surveyAnswers.q2} 
                      onChange={e => setSurveyAnswers({...surveyAnswers, q2: e.target.value})}
                      className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="1">Menos de 1 porción diaria</option>
                      <option value="2">1 a 2 porciones al día</option>
                      <option value="3">3 o más porciones al día</option>
                    </select>
                  </div>

                  {/* Pregunta 3: Granos Andinos */}
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <label className="block text-xs font-black text-gray-800 mb-2">
                      3. ¿Incluye cereales andinos (quinua, kiwicha, cañihua) en sus comidas?
                    </label>
                    <select 
                      value={surveyAnswers.q3} 
                      onChange={e => setSurveyAnswers({...surveyAnswers, q3: e.target.value})}
                      className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="1">Casi nunca</option>
                      <option value="2">Algunas veces al mes</option>
                      <option value="3">Semanalmente o a diario con Pukamisky</option>
                    </select>
                  </div>

                  {/* Pregunta 4: Hidratación */}
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <label className="block text-xs font-black text-gray-800 mb-2">
                      4. ¿Cuánta agua pura toma al día?
                    </label>
                    <select 
                      value={surveyAnswers.q4} 
                      onChange={e => setSurveyAnswers({...surveyAnswers, q4: e.target.value})}
                      className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="1">Menos de 2 vasos</option>
                      <option value="2">2 a 4 vasos de agua</option>
                      <option value="3">Más de 4 vasos de agua</option>
                    </select>
                  </div>

                  {/* Pregunta 5: Signos de fatiga */}
                  <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100">
                    <label className="block text-xs font-black text-gray-800 mb-2">
                      5. ¿Has notado cansancio inusual, sueño en clases o palidez en su rostro?
                    </label>
                    <select 
                      value={surveyAnswers.q5} 
                      onChange={e => setSurveyAnswers({...surveyAnswers, q5: e.target.value})}
                      className="w-full p-2.5 rounded-xl border bg-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="1">Con frecuencia (Atención)</option>
                      <option value="2">A veces</option>
                      <option value="3">Casi nunca, tiene mucha energía</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleCalculateSurvey}
                  className="w-full mt-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg transition active:scale-95"
                >
                  Obtener Diagnóstico y Semáforo
                </button>
              </div>
            ) : (
              /* RESULTADO DE LA EVALUACIÓN */
              <div className="text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 text-4xl shadow-inner ${
                  surveyResult.trafficLight === 'GREEN' 
                    ? 'bg-green-100 text-green-600' 
                    : (surveyResult.trafficLight === 'YELLOW' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600')
                }`}>
                  {surveyResult.trafficLight === 'GREEN' ? '🟢' : (surveyResult.trafficLight === 'YELLOW' ? '🟡' : '🔴')}
                </div>

                <span className={`inline-block text-xs font-black uppercase px-3 py-1 rounded-full mb-2 ${
                  surveyResult.trafficLight === 'GREEN' 
                    ? 'bg-green-100 text-green-800' 
                    : (surveyResult.trafficLight === 'YELLOW' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800')
                }`}>
                  Semáforo Nutricional Pukamisky
                </span>

                <h3 className="text-2xl font-black text-gray-800 mb-2">{surveyResult.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mb-5">
                  {surveyResult.description}
                </p>

                <div className="bg-gray-50 p-4 rounded-2xl text-left border border-gray-100 mb-6">
                  <h4 className="font-black text-xs text-gray-800 uppercase tracking-wider mb-2">
                    💡 Recomendaciones Personalizadas:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-600 font-medium">
                    {surveyResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold shrink-0">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setSurveyResult(null)}
                    className="flex-1 py-3 text-gray-600 font-bold border rounded-2xl text-xs hover:bg-gray-50"
                  >
                    Repetir Encuesta
                  </button>
                  <button 
                    onClick={() => {
                      setSurveyChild(null);
                      setSurveyResult(null);
                    }}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs shadow"
                  >
                    Guardar y Cerrar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
