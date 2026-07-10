import React from 'react';
import { motion } from 'motion/react';
import { Clock, Flame, Heart, User } from 'lucide-react';
import { Recipe } from '../types';

interface RecipeCardProps {
  key?: React.Key;
  recipe: Recipe;
  onSelect: (recipe: Recipe) => void;
  onToggleFavorite: (id: string, e?: React.MouseEvent) => void;
}

export default function RecipeCard({ recipe, onSelect, onToggleFavorite }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;

  // Choose a color theme depending on difficulty
  const difficultyColors = {
    'Łatwy': 'bg-sage/10 text-sage border-sage/20',
    'Średni': 'bg-amber-50 text-amber-800 border-amber-100',
    'Trudny': 'bg-rose-50 text-rose-800 border-rose-100',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      onClick={() => onSelect(recipe)}
      className="group cursor-pointer bg-white border border-polish-border/80 rounded-[16px] shadow-soft hover:border-sage/35 transition-all duration-300 overflow-hidden flex flex-col h-full relative"
    >
      {/* Recipe Image with category badge */}
      <div className="relative aspect-video w-full bg-[#FBFBF9] overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback image if custom image fails
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800';
            }}
          />
        ) : (
          <div className="w-full h-full bg-[#7B8C69]/10 flex items-center justify-center text-sage">
            <Flame className="w-10 h-10 animate-pulse" />
          </div>
        )}

        {/* Favorite heart button */}
        <button
          onClick={(e) => onToggleFavorite(recipe.id, e)}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white text-espresso rounded-full flex items-center justify-center shadow-sm backdrop-blur-xs transition-transform active:scale-90 z-10"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${
              recipe.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 group-hover:text-espresso'
            }`}
          />
        </button>

        {/* Category Badge */}
        <span className="absolute bottom-3 left-3 px-3 py-1 bg-espresso/80 text-white text-[11px] font-semibold rounded-full backdrop-blur-xs tracking-wider">
          {recipe.category}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-2">
          {/* Metadata: Time and Difficulty */}
          <div className="flex items-center gap-3 text-xs text-gray-400 font-sans">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{totalTime} min</span>
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${difficultyColors[recipe.difficulty] || 'bg-gray-50 text-gray-600'}`}>
              {recipe.difficulty}
            </span>
          </div>

          {/* Title - Playfair Display */}
          <h3 className="text-xl font-serif font-bold tracking-tight text-espresso leading-tight group-hover:text-sage transition-colors line-clamp-1 pt-1">
            {recipe.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-500 font-sans line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-4 pt-3 border-t border-polish-border flex items-center justify-between text-xs text-gray-400 font-sans">
          <span className="flex items-center gap-1.5 font-medium text-gray-600">
            <User className="w-3.5 h-3.5 text-sage" />
            <span className="truncate max-w-[120px]">{recipe.createdBy}</span>
          </span>
          <span className="text-[10px] text-gray-400">
            {new Date(recipe.createdAt).toLocaleDateString('pl-PL')}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
