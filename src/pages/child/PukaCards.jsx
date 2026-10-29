import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import api from '../../services/api';

export default function PukaCards() {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);
  const [newCard, setNewCard] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  const [ownedCardIds, setOwnedCardIds] = useState([]);

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      // Obtener el catálogo completo y las cartas del niño simultáneamente
      const [catalogRes, ownedRes] = await Promise.all([
        api.get('/cards/catalog'),
        api.get('/cards/me')
      ]);
      
      setCards(catalogRes.data);
      setOwnedCardIds(ownedRes.data.map(c => c.id));
    } catch (error) {
      console.error("Error al cargar cartas", error);
    } finally {
      setLoading(false);
    }
  };

  const drawCard = async () => {
    if (opening) return;
    setOpening(true);
    setNewCard(null);
    setErrorMessage(null);
    try {
      const { data } = await api.post('/cards/me/draw');
      
      setTimeout(() => {
        setNewCard(data);
        setOpening(false);
        fetchCards();
      }, 2000);
      
    } catch (error) {
      setErrorMessage(error.response?.data?.detail || "Error al abrir el sobre");
      setOpening(false);
    }
  };

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'LEGENDARY': return 'from-yellow-400 to-orange-500 shadow-yellow-400/50 text-white border-yellow-200';
      case 'EPIC': return 'from-purple-500 to-pink-500 shadow-purple-500/50 text-white border-purple-300';
      case 'RARE': return 'from-blue-400 to-blue-600 shadow-blue-500/50 text-white border-blue-300';
      default: return 'from-gray-100 to-gray-200 text-gray-700 border-gray-300';
    }
  };

  const getRarityLabel = (rarity) => {
    switch(rarity) {
      case 'LEGENDARY': return 'Legendaria';
      case 'EPIC': return 'Épica';
      case 'RARE': return 'Rara';
      default: return 'Común';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pb-20 font-sans">
      <header className="bg-gray-800 px-6 py-4 shadow-sm flex items-center justify-between sticky top-0 z-20 border-b border-gray-700">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-gray-700 rounded-full hover:bg-gray-600 transition">
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            Álbum Puka
          </h1>
        </div>
      </header>

      <main className="p-6 max-w-lg mx-auto space-y-8 animate-fade-in">
        
        {/* Zona de Gacha (Abrir Sobres) */}
        <section className="bg-gradient-to-br from-indigo-900 to-purple-900 p-8 rounded-[2rem] shadow-2xl border border-indigo-500/30 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
          
          <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-white mb-2">Sobre Sorpresa</h2>
          <p className="text-indigo-200 mb-6 font-semibold">Gasta 50 ⭐ para descubrir una nueva carta. ¿Te saldrá una Legendaria?</p>
          
          <button 
            onClick={drawCard}
            disabled={opening}
            className={`w-full py-4 rounded-2xl font-black text-lg transition-all transform flex items-center justify-center gap-2 ${
              opening ? 'bg-gray-600 text-gray-400 scale-95' : 'bg-yellow-400 text-yellow-900 hover:bg-yellow-300 hover:scale-[1.02] shadow-lg shadow-yellow-400/20'
            }`}
          >
            {opening ? 'Abriendo...' : 'Abrir Sobre (50 ⭐)'}
          </button>
        </section>

        {/* Error Modal */}
        {errorMessage && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-slide-up">
              <div className="w-20 h-20 bg-red-100 text-puka-red rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">⭐</span>
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-2">¡Ups!</h3>
              <p className="text-gray-600 font-semibold mb-6">{errorMessage}</p>
              <button 
                onClick={() => setErrorMessage(null)}
                className="w-full py-4 bg-puka-red text-white font-black rounded-2xl hover:bg-red-700 active:scale-95 transition-all shadow-lg"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        {/* Modal de Carta Nueva */}
        {newCard && (
          <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-sm animate-fade-in">
            <h2 className="text-4xl font-black text-white mb-8 animate-bounce">¡Nueva Carta!</h2>
            
            <div className={`w-64 h-96 rounded-3xl p-1 bg-gradient-to-br ${getRarityColor(newCard.rarity)} shadow-2xl transform hover:scale-105 transition-transform duration-500 rotate-y-180 animate-flip`}>
              <div className="w-full h-full bg-black/20 backdrop-blur-md rounded-[1.4rem] p-4 flex flex-col items-center text-center border-2 border-white/20">
                <div className="flex-1 w-full bg-white/10 rounded-xl mb-4 flex items-center justify-center">
                  <span className="text-6xl">🃏</span>
                </div>
                <h3 className="font-black text-xl mb-1">{newCard.name}</h3>
                <span className="text-xs font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-3">
                  {getRarityLabel(newCard.rarity)}
                </span>
                <p className="text-sm font-semibold opacity-90 line-clamp-3">
                  {newCard.description || 'Una carta misteriosa de la región.'}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setNewCard(null)}
              className="mt-10 px-8 py-3 bg-white text-gray-900 rounded-full font-black hover:bg-gray-200 transition-colors"
            >
              ¡Increíble!
            </button>
          </div>
        )}

        {/* Modal de Detalle de Carta (Al presionar en el Álbum) */}
        {selectedCard && (
          <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedCard(null)}>
            <div 
              className={`w-72 h-auto min-h-[24rem] rounded-3xl p-1 bg-gradient-to-br ${getRarityColor(selectedCard.rarity)} shadow-2xl transform animate-slide-up`}
              onClick={(e) => e.stopPropagation()} // Para que no se cierre al hacer clic dentro de la carta
            >
              <div className="w-full h-full bg-black/40 backdrop-blur-md rounded-[1.4rem] p-6 flex flex-col items-center text-center border-2 border-white/20">
                <div className="flex-1 w-full bg-white/10 rounded-2xl mb-6 flex items-center justify-center py-8">
                  <span className="text-7xl drop-shadow-lg">🃏</span>
                </div>
                
                <h3 className="font-black text-2xl mb-2 text-white">{selectedCard.name}</h3>
                
                <div className="flex gap-2 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full">
                    {getRarityLabel(selectedCard.rarity)}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest bg-black/40 text-white px-3 py-1 rounded-full">
                    {selectedCard.category}
                  </span>
                </div>
                
                <p className="text-base font-semibold text-gray-200 mb-6 px-2">
                  {selectedCard.description || 'Una carta misteriosa de la región.'}
                </p>

                <button 
                  onClick={() => setSelectedCard(null)}
                  className="w-full py-3 mt-auto bg-white/20 hover:bg-white/30 text-white rounded-xl font-bold transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Álbum Agrupado por Categorías */}
        <section>
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <Star className="text-yellow-400 w-6 h-6" /> Tu Álbum
          </h2>
          
          {loading ? (
            <p className="text-gray-500 text-center py-8 font-bold">Cargando álbum...</p>
          ) : cards.length === 0 ? (
            <p className="text-gray-500 text-center py-8 font-bold">Aún no tienes cartas. ¡Abre un sobre!</p>
          ) : (
            <div className="space-y-8">
              {['NATURALEZA', 'VALORES', 'CONOCIMIENTOS', 'HABILIDADES'].map(category => {
                const categoryCards = cards.filter(c => c.category === category);
                if (categoryCards.length === 0) return null;

                const getCategoryColor = (cat) => {
                  switch(cat) {
                    case 'NATURALEZA': return 'bg-green-500/20 text-green-400 border-green-500/30';
                    case 'VALORES': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
                    case 'CONOCIMIENTOS': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
                    case 'HABILIDADES': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
                    default: return 'bg-gray-500/20 text-gray-400';
                  }
                };

                return (
                  <div key={category} className="space-y-4">
                    <h3 className={`text-sm font-black tracking-widest uppercase px-4 py-2 rounded-xl border ${getCategoryColor(category)} inline-block`}>
                      {category}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {categoryCards.map((card) => {
                        const isOwned = ownedCardIds.includes(card.id);

                        return (
                          <div 
                            key={card.id} 
                            onClick={() => isOwned && setSelectedCard(card)}
                            className={`rounded-2xl p-1 ${isOwned ? `bg-gradient-to-br ${getRarityColor(card.rarity)} cursor-pointer hover:scale-105 transition-transform shadow-lg` : 'bg-gray-800 border-2 border-gray-700 opacity-60 grayscale'}`}
                          >
                            <div className="w-full h-40 bg-black/20 backdrop-blur-sm rounded-[1rem] p-3 flex flex-col items-center justify-center text-center relative overflow-hidden">
                              {isOwned ? (
                                <>
                                  <span className="text-3xl mb-2 z-10">🃏</span>
                                  <h3 className="font-black text-sm leading-tight mb-1 z-10">{card.name}</h3>
                                  <span className="text-[0.6rem] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full z-10">
                                    {getRarityLabel(card.rarity)}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-3xl mb-2 z-10 opacity-30">🔒</span>
                                  <h3 className="font-black text-sm leading-tight mb-1 z-10 text-gray-500">???</h3>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
