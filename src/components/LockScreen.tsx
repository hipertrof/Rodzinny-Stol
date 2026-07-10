import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Utensils, Heart } from 'lucide-react';

interface LockScreenProps {
  onUnlock: () => void;
}

export default function LockScreen({ onUnlock }: LockScreenProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase().trim() === 'mikolaj') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4 text-espresso">
      {/* Background elegant circles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-sage/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-sage/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-white border border-polish-border shadow-soft rounded-[24px] p-8 md:p-10 relative overflow-hidden"
      >
        {/* Card header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 bg-sage rounded-xl flex items-center justify-center text-white font-serif italic text-2xl shadow-sm mb-4">
            R
          </div>
          <h1 className="text-3xl font-serif font-bold tracking-tight text-espresso mb-2">
            Rodzinny Stół
          </h1>
          <p className="text-sm text-gray-500 font-sans max-w-xs">
            Witaj w prywatnej rodzinnej książce kucharskiej. Wpisz hasło, aby wejść do spiżarni przepisów.
          </p>
        </div>

        {/* Lock form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="passcode" className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest font-sans">
              Hasło Rodzinne
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock className="w-4 h-4" />
              </span>
              <input
                id="passcode"
                type="password"
                placeholder="Wpisz hasło..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-full bg-[#FBFBF9] border transition-all duration-200 outline-none font-sans text-sm ${
                  error 
                    ? 'border-red-400 focus:ring-1 focus:ring-red-400' 
                    : 'border-polish-border focus:border-sage focus:ring-1 focus:ring-sage'
                }`}
                autoFocus
              />
            </div>
            
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-red-500 mt-2 font-medium"
                >
                  Niepoprawne hasło. Spróbuj ponownie. Hint: imię świętego od prezentów
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-sage hover:bg-sage-dark text-white font-medium py-3 px-6 rounded-full transition-all duration-200 shadow-sm text-sm tracking-wide flex items-center justify-center gap-2 cursor-pointer"
          >
            Wejdź do Książki
          </motion.button>
        </form>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-gray-400 flex items-center justify-center gap-1 font-sans">
          <span>Stworzone z</span>
          <Heart className="w-3.5 h-3.5 text-red-400 fill-current" />
          <span>dla całej rodziny</span>
        </div>
      </motion.div>
    </div>
  );
}
