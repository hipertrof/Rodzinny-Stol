import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Plus, BookOpen, Heart, Info, 
  CheckCircle2, AlertCircle, Sparkles, Utensils
} from 'lucide-react';
import { Recipe, SEED_RECIPES, CATEGORIES } from './types';
import LockScreen from './components/LockScreen';
import Sidebar from './components/Sidebar';
import RecipeCard from './components/RecipeCard';
import RecipeDetails from './components/RecipeDetails';
import RecipeForm from './components/RecipeForm';
import { recipeService } from './lib/recipeService';

export default function App() {
  // Passcode gate state
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('rodzinny_stol_unlocked') === 'true';
  });

  // Recipes state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Active view tab state ('all' | 'favorites' | 'backup' | 'about')
  const [activeTab, setActiveTab] = useState<string>('all');
  
  // Search and Category filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Wszystkie');

  // Selected Recipe details modal state
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);

  // Alerts
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load recipes from Firestore on mount
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const data = await recipeService.getRecipes();
        setRecipes(data);
      } catch (err) {
        console.error("Error loading recipes from Firestore:", err);
        triggerError("Nie udało się pobrać przepisów z bazy danych. Załadowano dane awaryjne.");
        // fallback to localStorage or SEED_RECIPES
        const localData = localStorage.getItem('rodzinny_stol_przepisy');
        if (localData) {
          try {
            setRecipes(JSON.parse(localData));
          } catch (e) {
            setRecipes(SEED_RECIPES);
          }
        } else {
          setRecipes(SEED_RECIPES);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('rodzinny_stol_unlocked', 'true');
  };

  const handleLogout = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('rodzinny_stol_unlocked');
  };

  // Toast triggers
  const triggerSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  // Recipe Operations
  const handleSaveRecipe = async (recipeData: Omit<Recipe, 'id' | 'createdAt'> & { id?: string; createdAt?: string }) => {
    try {
      if (recipeData.id) {
        // Edit Mode
        const updatedFields = {
          title: recipeData.title,
          description: recipeData.description,
          category: recipeData.category,
          prepTime: recipeData.prepTime,
          cookTime: recipeData.cookTime,
          difficulty: recipeData.difficulty,
          portions: recipeData.portions,
          ingredients: recipeData.ingredients,
          steps: recipeData.steps,
          imageUrl: recipeData.imageUrl,
          createdBy: recipeData.createdBy,
        };
        await recipeService.updateRecipe(recipeData.id, updatedFields);

        const updated = recipes.map(r => {
          if (r.id === recipeData.id) {
            return {
              ...r,
              ...recipeData,
            } as Recipe;
          }
          return r;
        });
        setRecipes(updated);
        
        // Update selected recipe view if open
        if (selectedRecipe && selectedRecipe.id === recipeData.id) {
          const matchingUpdated = updated.find(r => r.id === recipeData.id);
          if (matchingUpdated) setSelectedRecipe(matchingUpdated);
        }

        triggerSuccess(`Przepis "${recipeData.title}" został pomyślnie zaktualizowany.`);
      } else {
        // Add Mode
        const newRecipeData = {
          ...recipeData,
          createdAt: new Date().toISOString(),
          isFavorite: false
        };
        const savedRecipe = await recipeService.addRecipe(newRecipeData);
        setRecipes([savedRecipe, ...recipes]);
        triggerSuccess(`Przepis "${recipeData.title}" został pomyślnie dodany do książki.`);
      }
      setIsFormOpen(false);
      setRecipeToEdit(null);
    } catch (err) {
      console.error("Error saving recipe:", err);
      triggerError("Nie udało się zapisać przepisu w bazie danych.");
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      const toDelete = recipes.find(r => r.id === id);
      await recipeService.deleteRecipe(id);
      const updated = recipes.filter(r => r.id !== id);
      setRecipes(updated);
      if (toDelete) {
        triggerSuccess(`Przepis "${toDelete.title}" został pomyślnie usunięty.`);
      }
      setSelectedRecipe(null);
    } catch (err) {
      console.error("Error deleting recipe:", err);
      triggerError("Nie udało się usunąć przepisu z bazy danych.");
    }
  };

  const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent opening recipe card modal
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    const newFavoriteState = !recipe.isFavorite;

    try {
      // Optimistic update
      const updated = recipes.map(r => {
        if (r.id === id) {
          return { ...r, isFavorite: newFavoriteState };
        }
        return r;
      });
      setRecipes(updated);
      
      // Update selected recipe details state if currently open
      if (selectedRecipe && selectedRecipe.id === id) {
        setSelectedRecipe(prev => prev ? { ...prev, isFavorite: newFavoriteState } : null);
      }

      await recipeService.updateRecipe(id, { isFavorite: newFavoriteState });
    } catch (err) {
      console.error("Error toggling favorite:", err);
      triggerError("Nie udało się zaktualizować statusu ulubionego.");
      // Rollback
      const rolledBack = recipes.map(r => {
        if (r.id === id) {
          return { ...r, isFavorite: !newFavoriteState };
        }
        return r;
      });
      setRecipes(rolledBack);
      if (selectedRecipe && selectedRecipe.id === id) {
        setSelectedRecipe(prev => prev ? { ...prev, isFavorite: !newFavoriteState } : null);
      }
    }
  };

  // Trigger add modal
  const openAddForm = () => {
    setRecipeToEdit(null);
    setIsFormOpen(true);
  };

  // Trigger edit modal
  const openEditForm = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setIsFormOpen(true);
  };

  // Filtering Logic
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'Wszystkie' || recipe.category === selectedCategory;
    const matchesFavoritesTab = activeTab !== 'favorites' || recipe.isFavorite;

    return matchesSearch && matchesCategory && matchesFavoritesTab;
  });

  // If locked, show Lock screen
  if (!isUnlocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-cream text-espresso font-sans flex flex-col md:flex-row relative selection:bg-sage/20 print:bg-white print:block">
      
      {/* Background visual accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sage/5 rounded-full blur-3xl pointer-events-none z-0 print:hidden" />
      <div className="absolute bottom-0 left-64 w-[600px] h-[600px] bg-sage/5 rounded-full blur-3xl pointer-events-none z-0 print:hidden" />

      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Auto clear filters when switching tabs for clean experience
          setSearchQuery('');
          setSelectedCategory('Wszystkie');
        }} 
        onLogout={handleLogout}
        onAddClick={openAddForm}
      />

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-h-screen pb-24 md:pb-8 relative z-10 print:pb-0 print:min-h-0 print:block">
        
        {/* Top Header Panel (Sticky header with search & add trigger) */}
        <header className="bg-white/90 backdrop-blur-md border-b border-polish-border px-6 md:px-10 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 z-20 print:hidden">
          {/* Page/View Title */}
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-espresso flex items-center gap-2">
              {activeTab === 'all' && 'Rodzinne Przepisy'}
              {activeTab === 'favorites' && 'Ulubione Przepisy'}
              {activeTab === 'backup' && 'Kopia i Przenoszenie'}
              {activeTab === 'about' && 'O Książce Kucharskiej'}
            </h1>
            <p className="text-xs text-gray-500 font-sans mt-0.5">
              {activeTab === 'all' && `Przeglądaj wszystkie przepisy naszej rodziny (${filteredRecipes.length})`}
              {activeTab === 'favorites' && `Twoje ulubione smaki, wybrane przez członków rodziny (${filteredRecipes.length})`}
              {activeTab === 'backup' && 'Eksportuj lub importuj bazę przepisów w formacie JSON.'}
              {activeTab === 'about' && 'Tradycja i kulinarna historia naszego domu.'}
            </p>
          </div>

          {/* Quick Search for Recipes List */}
          {(activeTab === 'all' || activeTab === 'favorites') && (
            <div className="relative w-full sm:max-w-xs">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Szukaj potrawy, składnika, autora..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full bg-gray-50 border border-gray-200 focus:border-sage focus:ring-1 focus:ring-sage outline-none text-xs transition-all font-sans"
              />
            </div>
          )}
        </header>

        {/* Global Action Notifications (Success & Error Toasts) */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 right-6 bg-white border border-emerald-100 shadow-md p-4 rounded-xl flex items-center gap-3 text-emerald-800 z-40 max-w-sm font-sans text-xs"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-20 right-6 bg-white border border-red-100 shadow-md p-4 rounded-xl flex items-center gap-3 text-red-800 z-40 max-w-sm font-sans text-xs"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="p-6 flex-grow print:p-0">
          
          {/* Tab View 1: Recipe Listing (All or Favorites) */}
          {(activeTab === 'all' || activeTab === 'favorites') && (
            <div className="space-y-6">
              
              {/* Categories Horizontal Filter Chips (Hidden on print) */}
              <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto print:hidden">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-sage text-white shadow-xs'
                          : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50 hover:text-espresso'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Recipes Grid */}
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-20"
                  >
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sage"></div>
                    <p className="text-sm text-gray-500 font-sans mt-4">Ładowanie przepisów z bazy danych...</p>
                  </motion.div>
                ) : filteredRecipes.length > 0 ? (
                  <motion.div 
                    layout
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {filteredRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onSelect={setSelectedRecipe}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center text-center py-20 bg-white/60 border border-gray-100/50 rounded-2xl p-8"
                  >
                    <BookOpen className="w-12 h-12 text-gray-300 mb-3" />
                    <h3 className="text-lg font-serif font-semibold text-espresso">
                      Brak przepisów do wyświetlenia
                    </h3>
                    <p className="text-xs text-gray-400 font-sans max-w-sm mt-1">
                      Spróbuj zmienić parametry wyszukiwania lub kategorię filtrów, albo dodaj swój pierwszy rodzinny przepis już dziś!
                    </p>
                    <button
                      onClick={openAddForm}
                      className="mt-4 flex items-center gap-1.5 bg-sage hover:bg-sage-dark text-white text-xs font-semibold py-2 px-4 rounded-full transition-all shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Dodaj pierwszy przepis</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Tab View 3: About / Project Info */}
          {activeTab === 'about' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-2xs space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-14 h-14 bg-sage-light text-sage rounded-full flex items-center justify-center mx-auto">
                    <Utensils className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-espresso pt-2">
                    Rodzinny Stół
                  </h3>
                  <p className="text-xs text-sage italic font-serif">
                    „Dom to nie miejsce, gdzie mieszkasz, ale ludzie, z którymi dzielisz stół.”
                  </p>
                </div>

                <div className="h-[1px] bg-gray-100 my-4" />

                <div className="space-y-4 text-sm font-sans text-gray-600 leading-relaxed">
                  <p>
                    Witaj w prywatnej przestrzeni kulinarnej naszej rodziny. <strong>Rodzinny Stół</strong> powstał z potrzeby zebrania, uporządkowania i ocalenia od zapomnienia wszystkich wspaniałych domowych smaków, które towarzyszyły nam przez lata.
                  </p>
                  <p>
                    To tutaj sekretne proporcje Babci Marysi na wigilijny barszcz czerwony łączą się z maślanym sekretem na tradycyjne schabowe czy chrupiącą szarlotkę Mamy Ani.
                  </p>

                  <h4 className="font-serif font-bold text-base text-espresso pt-4">Zasady naszej rodzinnej kuchni:</h4>
                  <ul className="space-y-2.5 pl-1">
                    <li className="flex items-start gap-2 text-xs">
                      <Sparkles className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                      <span><strong>Dzielimy się historią:</strong> Każdy przepis ma swoją opowieść. Dodając nową potrawę, napisz choć jedno słowo o tym, dlaczego jest dla nas ważna.</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs">
                      <Sparkles className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                      <span><strong>Tradycja i ewolucja:</strong> Możesz edytować przepisy, aby poprawić błędy lub dopisać nowe kulinarne spostrzeżenia.</span>
                    </li>
                    <li className="flex items-start gap-2 text-xs">
                      <Sparkles className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
                      <span><strong>Bez chaosu:</strong> Aplikacja służy wyłącznie do skupienia się na gotowaniu i wspólnym celebrowaniu smaków. Brak tu reklam, zbędnych komentarzy czy społecznościowego szumu.</span>
                    </li>
                  </ul>

                  <h4 className="font-serif font-bold text-base text-espresso pt-4">Jak korzystać z przydatnych funkcji?</h4>
                  <ul className="list-disc list-inside text-xs space-y-1 pl-1">
                    <li><strong>Skalowanie porcji:</strong> Po otwarciu przepisu możesz zmienić liczbę osób, a proporcje składników automatycznie się przeliczą!</li>
                    <li><strong>Interaktywne gotowanie:</strong> Odznaczaj składniki i kroki, które zostały już przygotowane, aby nie zgubić się w trakcie gotowania.</li>
                    <li><strong>Wygodne drukowanie:</strong> Przepisy są zoptymalizowane do druku — kliknij ikonkę drukarki w widoku szczegółów.</li>
                  </ul>
                </div>

                <div className="h-[1px] bg-gray-100 my-4" />

                <div className="text-center text-[10px] text-gray-400">
                  <span>Wersja aplikacji 1.0.0 · Projekt dedykowany i chroniony rodzinnym hasłem</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Password Footer Status */}
        <footer className="h-9 px-6 md:px-10 border-t border-polish-border bg-[#F1F0EC] flex items-center print:hidden">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider font-sans">Dostęp: Uwierzytelniono (mikolaj)</span>
          </div>
          <span className="ml-auto text-[10px] text-gray-400 italic font-sans">v1.0.4 • Made with love for the family</span>
        </footer>
      </main>

      {/* Recipe Detail Modal Overlay */}
      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetails
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
            onEdit={openEditForm}
            onDelete={handleDeleteRecipe}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </AnimatePresence>

      {/* Recipe Creation/Edit Modal Overlay */}
      <AnimatePresence>
        {isFormOpen && (
          <RecipeForm
            recipe={recipeToEdit || undefined}
            onClose={() => {
              setIsFormOpen(false);
              setRecipeToEdit(null);
            }}
            onSave={handleSaveRecipe}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
