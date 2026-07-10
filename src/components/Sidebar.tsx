import React from 'react';
import { BookOpen, Heart, Plus, Info, LogOut, Utensils } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  onAddClick: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onLogout, onAddClick }: SidebarProps) {
  const menuItems = [
    { id: 'all', label: 'Przepisy', icon: BookOpen },
    { id: 'favorites', label: 'Ulubione', icon: Heart },
    { id: 'about', label: 'O Projekcie', icon: Info },
  ];

  return (
    <>
      {/* Desktop Sidebar (Left side vertical narrow panel) */}
      <aside className="hidden md:flex flex-col justify-between w-64 h-screen bg-white border-r border-polish-border sticky top-0 px-4 py-8 text-espresso font-sans z-30 print:hidden">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-3 px-3">
            <div className="w-10 h-10 bg-sage rounded-xl flex items-center justify-center text-white font-serif italic text-xl shadow-sm">
              R
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold tracking-tight text-espresso leading-none">
                Rodzinny Stół
              </h2>
              <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase font-sans mt-0.5 block">
                Książka Kucharska
              </span>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="px-3">
            <button
              onClick={onAddClick}
              className="w-full flex items-center justify-center gap-2 bg-sage hover:bg-sage-dark text-white font-semibold py-2.5 px-4 rounded-full transition-all duration-200 shadow-sm text-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Dodaj przepis</span>
            </button>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 px-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 text-left cursor-pointer ${
                    isActive
                      ? 'bg-sage/10 text-sage'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-espresso'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-sage' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="space-y-2 px-1">
          <div className="h-[1px] bg-polish-border my-4" />
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50/50 hover:text-red-600 transition-all duration-200 text-left cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5 text-gray-400 group-hover:text-red-500" />
            <span>Zablokuj</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation Bar (Bottom horizontal strip) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-polish-border px-6 py-2 flex items-center justify-between shadow-lg z-40 print:hidden">
        {menuItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 p-2 focus:outline-none"
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-sage' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-sage' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Floating Add Button on mobile */}
        <button
          onClick={onAddClick}
          className="relative -top-5 w-12 h-12 bg-sage text-white rounded-full flex items-center justify-center shadow-md shadow-sage/30 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6" />
        </button>

        {menuItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 p-2 focus:outline-none"
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-sage' : 'text-gray-400'}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-sage' : 'text-gray-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
