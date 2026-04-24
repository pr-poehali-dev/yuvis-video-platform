import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Icon from '@/components/ui/icon';

interface SettingsPageProps {
  onAuthOpen: () => void;
  onNavigate: (page: string) => void;
}

export default function SettingsPage({ onAuthOpen, onNavigate }: SettingsPageProps) {
  const { user, isAuthenticated, changePassword, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passMsg, setPassMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDeleteZone, setShowDeleteZone] = useState(false);

  const handleChangePassword = () => {
    setPassMsg(null);
    if (!oldPass || !newPass || !confirmPass) { setPassMsg({ text: 'Заполните все поля', ok: false }); return; }
    if (newPass.length < 4) { setPassMsg({ text: 'Новый пароль минимум 4 символа', ok: false }); return; }
    if (newPass !== confirmPass) { setPassMsg({ text: 'Пароли не совпадают', ok: false }); return; }
    const ok = changePassword(oldPass, newPass);
    if (ok) {
      setPassMsg({ text: 'Пароль успешно изменён', ok: true });
      setOldPass(''); setNewPass(''); setConfirmPass('');
    } else {
      setPassMsg({ text: 'Неверный текущий пароль', ok: false });
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm !== user?.username) return;
    deleteAccount();
    onNavigate('home');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--yuvist-surface)' }}>
          <Icon name="Settings" size={36} className="text-yuvist-subtle" />
        </div>
        <h3 className="font-bold text-2xl mb-2" style={{ color: 'var(--yuvist-text)' }}>Настройки</h3>
        <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--yuvist-muted)' }}>Войдите, чтобы открыть настройки</p>
        <button onClick={onAuthOpen} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2">
          <Icon name="User" size={18} /> Войти
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in pb-10">
      <h2 className="font-bold text-2xl mb-8" style={{ color: 'var(--yuvist-text)' }}>Настройки</h2>

      {/* Appearance */}
      <section className="rounded-2xl border mb-6 overflow-hidden" style={{ background: 'var(--yuvist-surface)', borderColor: 'var(--yuvist-elevated)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--yuvist-elevated)' }}>
          <h3 className="font-semibold text-base" style={{ color: 'var(--yuvist-text)' }}>Внешний вид</h3>
        </div>
        <div className="px-6 py-5">
          <p className="text-sm mb-4" style={{ color: 'var(--yuvist-muted)' }}>Тема интерфейса</p>
          <div className="flex gap-3">
            {/* Dark */}
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-red-600' : 'border-transparent'}`}
              style={{ background: theme === 'dark' ? 'rgba(220,38,38,0.08)' : 'var(--yuvist-elevated)' }}
            >
              <div className="w-full h-10 rounded-lg bg-[#0f0f0f] flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#333]" />
                <div className="w-6 h-1 rounded bg-[#333]" />
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Moon" size={16} style={{ color: theme === 'dark' ? '#dc2626' : 'var(--yuvist-muted)' }} />
                <span className="text-sm font-medium" style={{ color: theme === 'dark' ? 'var(--yuvist-text)' : 'var(--yuvist-muted)' }}>Тёмная</span>
                {theme === 'dark' && <Icon name="Check" size={14} className="text-red-600" />}
              </div>
            </button>
            {/* Light */}
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-red-600' : 'border-transparent'}`}
              style={{ background: theme === 'light' ? 'rgba(220,38,38,0.08)' : 'var(--yuvist-elevated)' }}
            >
              <div className="w-full h-10 rounded-lg bg-[#f9f9f9] border border-gray-200 flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#ddd]" />
                <div className="w-6 h-1 rounded bg-[#ddd]" />
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Sun" size={16} style={{ color: theme === 'light' ? '#dc2626' : 'var(--yuvist-muted)' }} />
                <span className="text-sm font-medium" style={{ color: theme === 'light' ? 'var(--yuvist-text)' : 'var(--yuvist-muted)' }}>Светлая</span>
                {theme === 'light' && <Icon name="Check" size={14} className="text-red-600" />}
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Change password */}
      <section className="rounded-2xl border mb-6 overflow-hidden" style={{ background: 'var(--yuvist-surface)', borderColor: 'var(--yuvist-elevated)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--yuvist-elevated)' }}>
          <h3 className="font-semibold text-base" style={{ color: 'var(--yuvist-text)' }}>Безопасность</h3>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--yuvist-muted)' }}>Текущий пароль</label>
            <input
              type="password"
              value={oldPass}
              onChange={e => setOldPass(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
              style={{ background: 'var(--yuvist-elevated)', border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-text)' }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--yuvist-muted)' }}>Новый пароль</label>
              <input
                type="password"
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ background: 'var(--yuvist-elevated)', border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-text)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--yuvist-muted)' }}>Повторите пароль</label>
              <input
                type="password"
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors"
                style={{ background: 'var(--yuvist-elevated)', border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-text)' }}
              />
            </div>
          </div>
          {passMsg && (
            <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${passMsg.ok ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              <Icon name={passMsg.ok ? 'CheckCircle' : 'AlertCircle'} size={16} />
              {passMsg.text}
            </div>
          )}
          <button
            onClick={handleChangePassword}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors"
          >
            Сменить пароль
          </button>
        </div>
      </section>

      {/* Account info */}
      <section className="rounded-2xl border mb-6 overflow-hidden" style={{ background: 'var(--yuvist-surface)', borderColor: 'var(--yuvist-elevated)' }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--yuvist-elevated)' }}>
          <h3 className="font-semibold text-base" style={{ color: 'var(--yuvist-text)' }}>Аккаунт</h3>
        </div>
        <div className="px-6 py-5 space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-sm" style={{ color: 'var(--yuvist-muted)' }}>Логин</span>
            <span className="text-sm font-medium" style={{ color: 'var(--yuvist-text)' }}>@{user?.username}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm" style={{ color: 'var(--yuvist-muted)' }}>Имя канала</span>
            <span className="text-sm font-medium" style={{ color: 'var(--yuvist-text)' }}>{user?.displayName}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-sm" style={{ color: 'var(--yuvist-muted)' }}>Дата регистрации</span>
            <span className="text-sm" style={{ color: 'var(--yuvist-text)' }}>{user ? new Date(user.createdAt).toLocaleDateString('ru') : ''}</span>
          </div>
        </div>
      </section>

      {/* Danger zone */}
      <section className="rounded-2xl border border-red-500/30 overflow-hidden" style={{ background: 'var(--yuvist-surface)' }}>
        <div className="px-6 py-4 border-b border-red-500/20">
          <h3 className="font-semibold text-base text-red-500">Опасная зона</h3>
        </div>
        <div className="px-6 py-5">
          {!showDeleteZone ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--yuvist-text)' }}>Удалить канал</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--yuvist-muted)' }}>Аккаунт и все данные будут удалены навсегда</p>
              </div>
              <button
                onClick={() => setShowDeleteZone(true)}
                className="px-4 py-2 border border-red-500/50 text-red-500 hover:bg-red-500/10 rounded-xl text-sm font-medium transition-colors flex-shrink-0 ml-4"
              >
                Удалить
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm font-medium mb-1">Это действие необратимо!</p>
                <p className="text-red-400/70 text-xs">Введите ваш логин <span className="font-bold text-red-400">@{user?.username}</span> для подтверждения</p>
              </div>
              <input
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder={user?.username}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none border border-red-500/30 transition-colors"
                style={{ background: 'var(--yuvist-elevated)', color: 'var(--yuvist-text)' }}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteZone(false); setDeleteConfirm(''); }}
                  className="flex-1 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-muted)' }}
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirm !== user?.username}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Удалить навсегда
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
