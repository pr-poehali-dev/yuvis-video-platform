import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';

interface NavbarProps {
  onSearch: (q: string) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  onUpload: () => void;
  onAuthOpen: () => void;
}

export default function Navbar({ onSearch, onNavigate, currentPage, onUpload, onAuthOpen }: NavbarProps) {
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
      onNavigate('search');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-4" style={{ background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 flex-shrink-0 group"
      >
        <div className="w-8 h-8 rounded-lg bg-yuvist-red flex items-center justify-center group-hover:bg-yuvist-red-hover transition-colors">
          <Icon name="Play" size={16} className="text-white ml-0.5" />
        </div>
        <span className="text-white font-black text-xl tracking-tight hidden sm:block">
          Ювист
        </span>
      </button>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-auto flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-yuvist-surface border border-yuvist-elevated rounded-full px-4 py-2 focus-within:border-yuvist-red transition-colors">
          <Icon name="Search" size={16} className="text-yuvist-subtle flex-shrink-0" />
          <input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Поиск видео..."
            className="flex-1 bg-transparent text-yuvist-text placeholder-yuvist-subtle text-sm outline-none"
          />
          {searchValue && (
            <button type="button" onClick={() => setSearchValue('')}>
              <Icon name="X" size={14} className="text-yuvist-subtle hover:text-white" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-yuvist-surface border border-yuvist-elevated rounded-full hover:bg-yuvist-elevated transition-colors flex-shrink-0"
        >
          <Icon name="Search" size={16} className="text-yuvist-text" />
        </button>
      </form>

      {/* Right */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {user ? (
          <>
            <button
              onClick={onUpload}
              className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-yuvist-surface border border-yuvist-elevated rounded-full hover:bg-yuvist-elevated transition-colors text-sm text-yuvist-text"
            >
              <Icon name="Plus" size={16} />
              <span>Загрузить</span>
            </button>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img src={user.avatar} alt={user.displayName} className="w-8 h-8 rounded-full border-2 border-yuvist-red" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-10 w-52 bg-yuvist-surface border border-yuvist-elevated rounded-xl shadow-2xl overflow-hidden animate-scale-in z-50">
                  <div className="px-4 py-3 border-b border-yuvist-elevated">
                    <p className="text-white font-semibold text-sm">{user.displayName}</p>
                    <p className="text-yuvist-subtle text-xs">@{user.username}</p>
                  </div>
                  <button onClick={() => { onNavigate('profile'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yuvist-elevated transition-colors text-yuvist-text text-sm">
                    <Icon name="User" size={16} /> Мой канал
                  </button>
                  <button onClick={() => { onUpload(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yuvist-elevated transition-colors text-yuvist-text text-sm sm:hidden">
                    <Icon name="Upload" size={16} /> Загрузить видео
                  </button>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yuvist-elevated transition-colors text-red-400 text-sm">
                    <Icon name="LogOut" size={16} /> Выйти
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={onAuthOpen}
            className="flex items-center gap-2 px-4 py-1.5 border border-yuvist-red text-yuvist-red rounded-full hover:bg-yuvist-red hover:text-white transition-all text-sm font-medium"
          >
            <Icon name="User" size={16} />
            <span>Войти</span>
          </button>
        )}
      </div>
    </header>
  );
}
