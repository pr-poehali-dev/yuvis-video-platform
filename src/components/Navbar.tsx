import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/components/ui/icon';

interface NavbarProps {
  onSearch: (q: string) => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  onUpload: () => void;
  onAuthOpen: () => void;
}

export default function Navbar({ onSearch, onNavigate, onUpload, onAuthOpen }: NavbarProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue.trim());
      onNavigate('search');
      setSearchOpen(false);
    }
  };

  const navBg = theme === 'dark' ? 'rgba(15,15,15,0.97)' : 'rgba(249,249,249,0.97)';
  const navBorder = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  const textColor = 'var(--yuvist-text)';
  const mutedColor = 'var(--yuvist-muted)';

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-3 md:px-4 gap-3"
      style={{ background: navBg, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${navBorder}`, transition: 'background 0.2s ease' }}
    >
      {/* Logo */}
      <button onClick={() => onNavigate('home')} className="flex items-center gap-2 flex-shrink-0 group">
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors">
          <Icon name="Play" size={16} className="text-white ml-0.5" />
        </div>
        <span className="font-black text-xl tracking-tight hidden sm:block" style={{ color: textColor }}>Ювист</span>
      </button>

      {/* Search — desktop */}
      <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-2xl mx-auto gap-2">
        <div
          className="flex-1 flex items-center gap-2 rounded-full px-4 py-2 transition-colors focus-within:border-red-600"
          style={{ background: 'var(--yuvist-surface)', border: '1px solid var(--yuvist-elevated)' }}
        >
          <Icon name="Search" size={16} style={{ color: mutedColor, flexShrink: 0 }} />
          <input
            type="text"
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            placeholder="Поиск видео..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: textColor }}
          />
          {searchValue && (
            <button type="button" onClick={() => setSearchValue('')}>
              <Icon name="X" size={14} style={{ color: mutedColor }} />
            </button>
          )}
        </div>
        <button type="submit" className="px-4 py-2 rounded-full transition-colors" style={{ background: 'var(--yuvist-surface)', border: '1px solid var(--yuvist-elevated)' }}>
          <Icon name="Search" size={16} style={{ color: textColor }} />
        </button>
      </form>

      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="sm:hidden absolute inset-x-0 top-0 h-14 flex items-center px-3 gap-2 z-10"
          style={{ background: navBg }}>
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-full px-4 py-2"
              style={{ background: 'var(--yuvist-surface)', border: '1px solid var(--yuvist-elevated)' }}>
              <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Поиск..."
                autoFocus
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: textColor }}
              />
            </div>
            <button type="submit" className="px-3 py-2 bg-red-600 rounded-full">
              <Icon name="Search" size={16} className="text-white" />
            </button>
          </form>
          <button onClick={() => setSearchOpen(false)} style={{ color: mutedColor }}>
            <Icon name="X" size={20} />
          </button>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto sm:ml-0">
        {/* Mobile search btn */}
        <button className="sm:hidden p-2 rounded-full" style={{ color: mutedColor }} onClick={() => setSearchOpen(true)}>
          <Icon name="Search" size={20} />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="hidden sm:flex p-2 rounded-full transition-colors"
          style={{ color: mutedColor }}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
        </button>

        {user ? (
          <>
            <button
              onClick={onUpload}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors text-sm"
              style={{ background: 'var(--yuvist-surface)', border: '1px solid var(--yuvist-elevated)', color: textColor }}
            >
              <Icon name="Plus" size={16} />
              <span className="hidden md:inline">Загрузить</span>
            </button>

            <div className="relative">
              <button onClick={() => setMenuOpen(o => !o)} className="hover:opacity-80 transition-opacity">
                <img src={user.avatar} alt={user.displayName} className="w-8 h-8 rounded-full border-2 border-red-600 object-cover" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-10 w-56 rounded-xl shadow-2xl overflow-hidden animate-scale-in z-50"
                  style={{ background: 'var(--yuvist-surface)', border: '1px solid var(--yuvist-elevated)' }}
                >
                  <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--yuvist-elevated)' }}>
                    <p className="font-semibold text-sm" style={{ color: textColor }}>{user.displayName}</p>
                    <p className="text-xs" style={{ color: 'var(--yuvist-subtle)' }}>@{user.username}</p>
                  </div>
                  <button onClick={() => { onNavigate('profile'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-sm hover:bg-[var(--yuvist-elevated)]" style={{ color: textColor }}>
                    <Icon name="User" size={16} /> Мой канал
                  </button>
                  <button onClick={() => { onNavigate('settings'); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-sm hover:bg-[var(--yuvist-elevated)]" style={{ color: textColor }}>
                    <Icon name="Settings" size={16} /> Настройки
                  </button>
                  <button onClick={() => { onUpload(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-sm hover:bg-[var(--yuvist-elevated)] sm:hidden" style={{ color: textColor }}>
                    <Icon name="Upload" size={16} /> Загрузить видео
                  </button>
                  {/* Theme toggle mobile */}
                  <button onClick={() => { toggleTheme(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-sm hover:bg-[var(--yuvist-elevated)]" style={{ color: textColor }}>
                    <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={16} />
                    {theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
                  </button>
                  <div className="border-t" style={{ borderColor: 'var(--yuvist-elevated)' }} />
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 transition-colors text-sm text-red-400 hover:bg-[var(--yuvist-elevated)]">
                    <Icon name="LogOut" size={16} /> Выйти
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={toggleTheme} className="p-2 rounded-full sm:hidden" style={{ color: mutedColor }}>
              <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} size={20} />
            </button>
            <button
              onClick={onAuthOpen}
              className="flex items-center gap-2 px-3 md:px-4 py-1.5 border border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all text-sm font-medium"
            >
              <Icon name="User" size={16} />
              <span>Войти</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
