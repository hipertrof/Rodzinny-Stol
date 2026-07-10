import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Trash2, Image, Sparkles, HelpCircle, AlertCircle } from 'lucide-react';
import { Recipe, Ingredient, RECIPE_CATEGORIES_WITHOUT_ALL, UNITS, RecipeDifficulty } from '../types';

interface RecipeFormProps {
  recipe?: Recipe; // undefined means "Add Mode"
  onClose: () => void;
  onSave: (recipe: Omit<Recipe, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => void;
}

const PRESET_IMAGES = [
  { label: 'Obiad / Mięso / Warzywa', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' },
  { label: 'Zupa / Barszcz', url: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=800' },
  { label: 'Deser / Słodkości', url: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800' },
  { label: 'Śniadanie / Naleśniki', url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=800' },
  { label: 'Wypieki / Chleb / Bułki', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800' },
  { label: 'Przekąski / Tapas', url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&q=80&w=800' },
];

export default function RecipeForm({ recipe, onClose, onSave }: RecipeFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Obiad');
  const [prepTime, setPrepTime] = useState(20);
  const [cookTime, setCookTime] = useState(30);
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>('Średni');
  const [portions, setPortions] = useState(4);
  const [createdBy, setCreatedBy] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: 'g' }
  ]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [errors, setErrors] = useState<string[]>([]);

  // If in edit mode, populate state from recipe
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title);
      setDescription(recipe.description);
      setCategory(recipe.category);
      setPrepTime(recipe.prepTime);
      setCookTime(recipe.cookTime);
      setDifficulty(recipe.difficulty);
      setPortions(recipe.portions);
      setCreatedBy(recipe.createdBy);
      setImageUrl(recipe.imageUrl);
      setIngredients(recipe.ingredients.length > 0 ? [...recipe.ingredients] : [{ name: '', amount: '', unit: 'g' }]);
      setSteps(recipe.steps.length > 0 ? [...recipe.steps] : ['']);
    }
  }, [recipe]);

  // Ingredient handlers
  const handleIngredientChange = (index: number, key: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[index] = {
      ...updated[index],
      [key]: value
    };
    setIngredients(updated);
  };

  const addIngredientRow = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: 'g' }]);
  };

  const removeIngredientRow = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    } else {
      setIngredients([{ name: '', amount: '', unit: 'g' }]);
    }
  };

  // Step handlers
  const handleStepChange = (index: number, value: string) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStepRow = () => {
    setSteps([...steps, '']);
  };

  const removeStepRow = (index: number) => {
    if (steps.length > 1) {
      setSteps(steps.filter((_, i) => i !== index));
    } else {
      setSteps(['']);
    }
  };

  // Form Validation and Save
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: string[] = [];

    if (!title.trim()) validationErrors.push('Nazwa przepisu jest wymagana.');
    if (!createdBy.trim()) validationErrors.push('Podaj autora przepisu (kto dodaje).');
    
    // Check if there's at least one non-empty ingredient
    const validIngredients = ingredients.filter(ing => ing.name.trim() !== '');
    if (validIngredients.length === 0) {
      validationErrors.push('Przepis musi zawierać przynajmniej jeden składnik z nazwą.');
    }

    // Check if there's at least one non-empty step
    const validSteps = steps.filter(step => step.trim() !== '');
    if (validSteps.length === 0) {
      validationErrors.push('Przepis musi zawierać przynajmniej jeden krok przygotowania.');
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      // Scroll to top of the modal to see errors
      const modalContent = document.getElementById('form-modal-container');
      if (modalContent) modalContent.scrollTop = 0;
      return;
    }

    onSave({
      id: recipe?.id,
      title: title.trim(),
      description: description.trim(),
      category,
      prepTime: Number(prepTime) || 10,
      cookTime: Number(cookTime) || 0,
      difficulty,
      portions: Number(portions) || 4,
      ingredients: validIngredients,
      steps: validSteps,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800', // Default gorgeous placeholder
      createdBy: createdBy.trim(),
      createdAt: recipe?.createdAt,
    });
  };

  return (
    <div className="fixed inset-0 bg-espresso/50 backdrop-blur-xs flex items-center justify-center z-50 p-0 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="bg-white w-full max-w-3xl min-h-screen md:min-h-0 md:rounded-[24px] border border-polish-border shadow-soft overflow-hidden flex flex-col relative my-auto"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-polish-border bg-[#F1F0EC]">
          <div>
            <h2 className="text-2xl font-serif font-bold text-espresso">
              {recipe ? 'Edytuj Przepis' : 'Nowy Przepis'}
            </h2>
            <p className="text-xs text-gray-500 font-sans">
              Zapełnij pola, aby dodać przepis do rodzinnej księgi.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-espresso" />
          </button>
        </div>

        {/* Form Container */}
        <form 
          id="form-modal-container"
          onSubmit={handleSubmit} 
          className="overflow-y-auto max-h-[80vh] md:max-h-[75vh] p-6 space-y-8 font-sans text-sm text-espresso"
        >
          {/* Validation Warnings */}
          {errors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-red-700 font-semibold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Wykryto błędy w formularzu:</span>
              </div>
              <ul className="list-disc list-inside text-xs text-red-600 space-y-0.5 pl-1">
                {errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Section 1: Podstawy */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-sage uppercase tracking-widest border-b border-polish-border pb-1.5">
              1. Podstawowe Informacje
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Nazwa Przepisu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="np. Słodkie racuchy Babci..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-colors"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Kto dodaje / Autor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="np. Mama Ania, Babcia Marysia..."
                  value={createdBy}
                  onChange={(e) => setCreatedBy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Krótki Opis / Historia (Słowo od autora)
              </label>
              <textarea
                placeholder="Napisz krótki wstęp o przepisie, skąd pochodzi lub co go wyróżnia..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Kategoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-colors"
                >
                  {RECIPE_CATEGORIES_WITHOUT_ALL.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Poziom Trudności
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Łatwy', 'Średni', 'Trudny'] as RecipeDifficulty[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        difficulty === level
                          ? 'bg-sage/10 border-sage text-sage shadow-2xs'
                          : 'bg-white border-polish-border text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Czas i Parametry */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-sage uppercase tracking-widest border-b border-polish-border pb-1.5">
              2. Parametry i Czas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Przygotowanie (min)
                </label>
                <input
                  type="number"
                  min="0"
                  value={prepTime}
                  onChange={(e) => setPrepTime(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Gotowanie / Pieczenie (min)
                </label>
                <input
                  type="number"
                  min="0"
                  value={cookTime}
                  onChange={(e) => setCookTime(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Domyślna liczba porcji
                </label>
                <input
                  type="number"
                  min="1"
                  value={portions}
                  onChange={(e) => setPortions(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Zdjęcie */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold text-sage uppercase tracking-widest border-b border-polish-border pb-1.5">
              3. Zdjęcie Potrawy
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Image className="w-3.5 h-3.5 text-sage" />
                <span>Własny adres URL zdjęcia</span>
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none transition-colors"
              />
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-sage" />
                <span>Lub wybierz jedno z szybkich zdjęć gotowych potraw:</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 overflow-hidden ${
                      imageUrl === preset.url
                        ? 'bg-sage/10 border-sage shadow-2xs'
                        : 'bg-white border-polish-border hover:bg-gray-50'
                    }`}
                  >
                    <img 
                      src={preset.url} 
                      alt={preset.label} 
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <span className="text-[10px] font-medium leading-tight text-gray-600 truncate">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Składniki */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-polish-border pb-1.5">
              <h3 className="text-[11px] font-bold text-sage uppercase tracking-widest">
                4. Składniki <span className="text-red-500">*</span>
              </h3>
              <button
                type="button"
                onClick={addIngredientRow}
                className="flex items-center gap-1 text-xs font-semibold text-sage hover:text-sage-dark hover:bg-sage-light px-2.5 py-1 rounded-full transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dodaj składnik</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2.5 items-center">
                  <div className="grid grid-cols-12 gap-2 flex-grow">
                    {/* Ingredient Name (Col-6) */}
                    <div className="col-span-6 sm:col-span-7">
                      <input
                        type="text"
                        placeholder="Nazwa składnika (np. Mąka pszenna)"
                        value={ing.name}
                        onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none text-xs transition-colors"
                        required
                      />
                    </div>

                    {/* Ingredient Amount (Col-3) */}
                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Ilość (np. 200, 1/2, 2)"
                        value={ing.amount}
                        onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none text-xs text-center transition-colors"
                      />
                    </div>

                    {/* Ingredient Unit (Col-3) */}
                    <div className="col-span-3 sm:col-span-2">
                      <select
                        value={ing.unit}
                        onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                        className="w-full px-2 py-2 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none text-xs transition-colors"
                      >
                        {UNITS.map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(idx)}
                    className="w-8 h-8 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center flex-shrink-0 transition-colors"
                    title="Usuń rząd"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Kroki Sposobu Przygotowania */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-polish-border pb-1.5">
              <h3 className="text-[11px] font-bold text-sage uppercase tracking-widest">
                5. Sposób Przygotowania / Kroki <span className="text-red-500">*</span>
              </h3>
              <button
                type="button"
                onClick={addStepRow}
                className="flex items-center gap-1 text-xs font-semibold text-sage hover:text-sage-dark hover:bg-sage-light px-2.5 py-1 rounded-full transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dodaj krok</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  {/* Step Number */}
                  <div className="w-6 h-6 rounded-full bg-sage-light text-sage text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-2">
                    {idx + 1}
                  </div>

                  {/* Step Description Input */}
                  <textarea
                    placeholder="Opisz co należy zrobić w tym kroku..."
                    value={step}
                    onChange={(e) => handleStepChange(idx, e.target.value)}
                    rows={2}
                    className="flex-grow px-3 py-2 rounded-xl bg-[#FBFBF9] border border-polish-border focus:border-sage focus:ring-1 focus:ring-sage outline-none text-xs transition-colors resize-none"
                    required
                  />

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeStepRow(idx)}
                    className="w-8 h-8 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center flex-shrink-0 mt-1 transition-colors"
                    title="Usuń krok"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-polish-border bg-[#F1F0EC] flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-polish-border hover:bg-gray-100 text-xs font-semibold text-espresso transition-all cursor-pointer"
          >
            Anuluj
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-full bg-sage hover:bg-sage-dark text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
          >
            {recipe ? 'Zapisz zmiany' : 'Dodaj Przepis'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
