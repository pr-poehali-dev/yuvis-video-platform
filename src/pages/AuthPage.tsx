import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/icon';

interface AuthPageProps {
  onClose: () => void;
}

export default function AuthPage({ onClose }: AuthPageProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const ok = await login(username, password);
        if (ok) { onClose(); } else { setError('Неверный логин или пароль'); }
      } else {
        if (!username.trim() || !displayName.trim() || !password.trim()) {
          setError('Заполните все поля'); return;
        }
        if (password.length < 4) { setError('Пароль минимум 4 символа'); return; }
        const ok = await register(username, displayName, password);
        if (ok) { onClose(); } else { setError('Этот логин уже занят'); }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-yuvist-surface border border-yuvist-elevated rounded-2xl overflow-hidden animate-scale-in shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-yuvist-elevated">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yuvist-red flex items-center justify-center">
              <Icon name="Play" size={18} className="text-white ml-0.5" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Ювист</h2>
              <p className="text-yuvist-subtle text-xs">{mode === 'login' ? 'Вход в аккаунт' : 'Создание аккаунта'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-yuvist-subtle hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-yuvist-elevated">
          <button
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'login' ? 'text-white border-b-2 border-yuvist-red' : 'text-yuvist-subtle hover:text-white'}`}
          >
            Войти
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'register' ? 'text-white border-b-2 border-yuvist-red' : 'text-yuvist-subtle hover:text-white'}`}
          >
            Регистрация
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <label className="block text-yuvist-muted text-xs mb-1.5 font-medium">Логин</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="your_login"
              required
              className="w-full bg-yuvist-elevated border border-yuvist-elevated focus:border-yuvist-red rounded-xl px-4 py-3 text-white placeholder-yuvist-subtle text-sm outline-none transition-colors"
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-yuvist-muted text-xs mb-1.5 font-medium">Имя канала</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Моё имя"
                required
                className="w-full bg-yuvist-elevated border border-yuvist-elevated focus:border-yuvist-red rounded-xl px-4 py-3 text-white placeholder-yuvist-subtle text-sm outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-yuvist-muted text-xs mb-1.5 font-medium">Пароль</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-yuvist-elevated border border-yuvist-elevated focus:border-yuvist-red rounded-xl px-4 py-3 pr-12 text-white placeholder-yuvist-subtle text-sm outline-none transition-colors"
              />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-yuvist-subtle hover:text-white transition-colors">
                <Icon name={showPass ? 'EyeOff' : 'Eye'} size={18} />
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 rounded-xl px-4 py-3">
              <Icon name="AlertCircle" size={16} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yuvist-red hover:bg-yuvist-red-hover text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Загрузка...' : mode === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>
        </form>
      </div>
    </div>
  );
}
