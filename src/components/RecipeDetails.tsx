import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Clock, Users, Heart, Edit2, Trash2, Printer, 
  Check, ChevronRight, User, Calendar, BookOpen, Scale
} from 'lucide-react';
import { Recipe } from '../types';

interface RecipeDetailsProps {
  recipe: Recipe;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export default function RecipeDetails({ recipe, onClose, onEdit, onDelete, onToggleFavorite }: RecipeDetailsProps) {
  const [portions, setPortions] = useState(recipe.portions);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePortionChange = (change: number) => {
    setPortions(prev => Math.max(1, prev + change));
  };

  const toggleIngredientCheck = (index: number) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleStepCheck = (index: number) => {
    setCheckedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Scaler helper
  const scaleAmount = (amountStr: string, currentPortions: number, basePortions: number) => {
    if (!amountStr || amountStr.trim() === "") return "";
    const ratio = currentPortions / basePortions;

    // Handle string checks first
    const trimmed = amountStr.trim().replace(',', '.');
    
    // Parse fraction like "1/2" or "1/4"
    let numeric = parseFloat(trimmed);
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      if (parts.length === 2) {
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (!isNaN(num) && !isNaN(den) && den !== 0) {
          numeric = num / den;
        }
      }
    }

    if (isNaN(numeric)) {
      return amountStr; // Return original value (e.g. "do smaku", "szczypta")
    }

    const scaled = numeric * ratio;
    // Format nicely without unnecessary decimals
    const formatted = parseFloat(scaled.toFixed(2));
    return formatted.toString().replace('.', ',');
  };

  const handlePrint = () => {
    window.print();
  };

  const totalTime = recipe.prepTime + recipe.cookTime;

  return (
    <div className="fixed inset-0 bg-espresso/50 backdrop-blur-xs flex items-center justify-center z-50 p-0 md:p-6 overflow-y-auto print-recipe-modal print:static print:bg-white print:p-0">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="bg-white w-full max-w-4xl min-h-screen md:min-h-0 md:rounded-[24px] border border-polish-border shadow-soft overflow-hidden flex flex-col relative my-auto print:shadow-none print:rounded-none print:w-full print:min-h-0 print:block print:h-auto print:overflow-visible"
      >
        {/* Top Floating Control Bar (Hidden on print) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 print:hidden">
          <button
            onClick={() => onToggleFavorite(recipe.id)}
            className="w-10 h-10 bg-white/90 hover:bg-white text-espresso rounded-full flex items-center justify-center shadow-sm backdrop-blur-xs transition-transform active:scale-95"
            title={recipe.isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
          >
            <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
          </button>
          
          <button
            onClick={() => onEdit(recipe)}
            className="w-10 h-10 bg-white/90 hover:bg-white text-espresso rounded-full flex items-center justify-center shadow-sm backdrop-blur-xs transition-transform active:scale-95"
            title="Edytuj przepis"
          >
            <Edit2 className="w-4.5 h-4.5 text-gray-600" />
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-10 h-10 bg-white/90 hover:bg-white text-red-500 rounded-full flex items-center justify-center shadow-sm backdrop-blur-xs transition-transform active:scale-95"
            title="Usuń przepis"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>

          <button
            onClick={handlePrint}
            className="w-10 h-10 bg-white/90 hover:bg-white text-espresso rounded-full flex items-center justify-center shadow-sm backdrop-blur-xs transition-transform active:scale-95"
            title="Drukuj"
          >
            <Printer className="w-4.5 h-4.5 text-gray-600" />
          </button>

          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/90 hover:bg-white text-espresso rounded-full flex items-center justify-center shadow-sm backdrop-blur-xs transition-transform active:scale-95 border border-polish-border"
            title="Zamknij"
          >
            <X className="w-5 h-5 text-espresso" />
          </button>
        </div>

        {/* Print Only Header */}
        <div className="hidden print:block mb-8 border-b border-gray-200 pb-4">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-xs uppercase tracking-wider text-sage font-semibold">Rodzinny Stół — Przepis</span>
              <h1 className="text-3xl font-serif font-bold text-espresso mt-1">{recipe.title}</h1>
            </div>
            <div className="text-right text-xs text-gray-400 font-sans">
              <span>Autor: {recipe.createdBy}</span>
              <br />
              <span>Data utworzenia: {new Date(recipe.createdAt).toLocaleDateString('pl-PL')}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[100vh] md:max-h-[85vh] print:max-h-none print:overflow-visible">
          {/* Cover Hero Banner (Hidden on print) */}
          <div className="relative h-64 md:h-80 bg-gray-50 overflow-hidden print:hidden">
            {recipe.imageUrl ? (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-sage-light flex items-center justify-center text-sage">
                <BookOpen className="w-16 h-16" />
              </div>
            )}
            {/* Elegant overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-white">
                {recipe.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight mt-3 text-white">
                {recipe.title}
              </h2>
            </div>
          </div>

          {/* Main Details Body */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Quick Summary Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#FBFBF9] border border-polish-border rounded-[16px] p-4 text-sm text-espresso font-sans print:bg-white print:border print:border-polish-border print:grid-cols-4 shadow-2xs">
              <div className="flex flex-col items-center justify-center text-center p-2 border-r border-polish-border/60 last:border-0 print:border-r print:border-polish-border">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Przygotowanie</span>
                <span className="font-bold flex items-center gap-1.5 text-espresso text-sm md:text-base">
                  <Clock className="w-4 h-4 text-sage" />
                  {recipe.prepTime} min
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 md:border-r border-polish-border/60 last:border-0 print:border-r print:border-polish-border">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gotowanie</span>
                <span className="font-bold flex items-center gap-1.5 text-espresso text-sm md:text-base">
                  <Clock className="w-4 h-4 text-sage" />
                  {recipe.cookTime} min
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 border-r border-polish-border/60 last:border-0 print:border-r print:border-polish-border">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Porcje</span>
                <span className="font-bold flex items-center gap-1.5 text-espresso text-sm md:text-base">
                  <Users className="w-4 h-4 text-sage" />
                  {portions} porcji
                </span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-2 last:border-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Trudność</span>
                <span className="font-bold text-espresso text-sm md:text-base">
                  {recipe.difficulty}
                </span>
              </div>
            </div>

            {/* Description or personal story */}
            {recipe.description && (
              <div className="bg-[#F1F0EC] border-l-4 border-sage rounded-r-[12px] p-5">
                <h4 className="text-[10px] font-bold text-sage uppercase tracking-widest mb-1.5 font-sans">
                  Słowo od autora ({recipe.createdBy})
                </h4>
                <p className="text-espresso font-serif italic text-base leading-relaxed">
                  "{recipe.description}"
                </p>
              </div>
            )}

            {/* Dual Column: Ingredients & Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 print:block print:space-y-8">
              {/* Left Side: Ingredients (2/5 size on large screens) */}
              <div className="lg:col-span-2 space-y-6 print:w-full">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-2xl font-serif font-bold text-espresso">
                    Składniki
                  </h3>
                  
                  {/* Interactive Portions Scaler */}
                  <div className="flex items-center gap-2 bg-white border border-polish-border rounded-full py-1.5 px-3 shadow-2xs print:hidden">
                    <button
                      onClick={() => handlePortionChange(-1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FBFBF9] hover:bg-gray-100 text-espresso text-sm font-bold transition-all cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-semibold font-mono w-16 text-center text-espresso">
                      {portions} os.
                    </span>
                    <button
                      onClick={() => handlePortionChange(1)}
                      className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FBFBF9] hover:bg-gray-100 text-espresso text-sm font-bold transition-all cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <ul className="space-y-3 font-sans">
                  {recipe.ingredients.map((ing, idx) => {
                    const scaled = scaleAmount(ing.amount, portions, recipe.portions);
                    const isChecked = !!checkedIngredients[idx];

                    return (
                      <li
                        key={idx}
                        onClick={() => toggleIngredientCheck(idx)}
                        className={`flex items-start gap-3 cursor-pointer group select-none py-1 transition-all ${
                          isChecked ? 'opacity-50 line-through text-gray-400' : 'text-espresso'
                        }`}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all print:hidden ${
                          isChecked 
                            ? 'bg-sage border-sage text-white' 
                            : 'border-polish-border group-hover:border-sage'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div className="text-sm leading-tight flex-grow">
                          <span className="font-medium mr-1.5 group-hover:text-sage transition-colors">{ing.name}</span>
                          {scaled && (
                            <span className="font-mono text-[11px] text-gray-500 bg-[#F1F0EC] px-1.5 py-0.5 rounded-sm">
                              {scaled} {ing.unit}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Right Side: Steps (3/5 size on large screens) */}
              <div className="lg:col-span-3 space-y-6 print:w-full">
                <div className="border-b border-polish-border pb-3">
                  <h3 className="text-2xl font-serif font-bold text-espresso">
                    Sposób przygotowania
                  </h3>
                </div>

                <div className="space-y-6">
                  {recipe.steps.map((step, idx) => {
                    const isChecked = !!checkedSteps[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStepCheck(idx)}
                        className={`flex gap-4 cursor-pointer select-none group transition-all p-3 rounded-[12px] hover:bg-[#FBFBF9] ${
                          isChecked ? 'opacity-40 bg-gray-50/20' : ''
                        }`}
                      >
                        {/* Step Number Badge */}
                        <div className={`w-8 h-8 rounded-full font-serif font-bold text-sm flex items-center justify-center flex-shrink-0 transition-colors ${
                          isChecked 
                            ? 'bg-gray-200 text-gray-500' 
                            : 'bg-sage-light text-sage group-hover:bg-sage group-hover:text-white'
                        }`}>
                          {idx + 1}
                        </div>
                        
                        {/* Step Description */}
                        <div className="space-y-1 flex-grow">
                          <p className={`text-sm font-sans leading-relaxed text-espresso ${
                            isChecked ? 'line-through text-gray-400' : ''
                          }`}>
                            {step}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Author Footer (Print friendly) */}
            <div className="pt-8 border-t border-polish-border flex items-center justify-between text-xs text-gray-400 font-sans">
              <span className="flex items-center gap-1">
                <User className="w-4 h-4 text-sage" />
                <span>Wpis dodany przez: <strong>{recipe.createdBy}</strong></span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-sage" />
                <span>Ostatnia modyfikacja: {new Date(recipe.createdAt).toLocaleDateString('pl-PL')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Overlay (Modal on top of Modal) */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="absolute inset-0 bg-espresso/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-polish-border max-w-sm w-full p-6 rounded-[20px] shadow-2xl text-center space-y-4"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <Trash2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-espresso">
                  Czy na pewno chcesz usunąć przepis?
                </h3>
                <p className="text-xs text-gray-500">
                  Przepisu <strong>"{recipe.title}"</strong> nie będzie można odzyskać. Ta operacja jest nieodwracalna.
                </p>
                <div className="flex items-center gap-3 justify-center pt-2">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-espresso rounded-full text-xs font-medium transition-all"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={() => {
                      onDelete(recipe.id);
                      onClose();
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-medium transition-all shadow-xs"
                  >
                    Tak, usuń przepis
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
