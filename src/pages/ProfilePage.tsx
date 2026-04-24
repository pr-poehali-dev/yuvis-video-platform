import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useVideos } from '@/context/VideoContext';
import VideoCard from '@/components/VideoCard';
import Icon from '@/components/ui/icon';

interface ProfilePageProps {
  onNavigate: (page: string, videoId?: string) => void;
  onAuthOpen: () => void;
  onUpload: () => void;
}

function EditProfileModal({ onClose }: { onClose: () => void }) {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setAvatarUrl(reader.result as string); };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!displayName.trim()) return;
    updateProfile({
      displayName: displayName.trim(),
      bio: bio.trim(),
      avatar: avatarUrl.trim() ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${displayName.trim()}&backgroundColor=dc2626&textColor=ffffff`,
    });
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  const previewSrc = avatarUrl ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}&backgroundColor=dc2626&textColor=ffffff`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl overflow-hidden animate-scale-in shadow-2xl" style={{ background: 'var(--yuvist-surface)', border: '1px solid var(--yuvist-elevated)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--yuvist-elevated)' }}>
          <h2 className="font-bold text-lg" style={{ color: 'var(--yuvist-text)' }}>Редактировать профиль</h2>
          <button onClick={onClose} style={{ color: 'var(--yuvist-subtle)' }}>
            <Icon name="X" size={20} />
          </button>
        </div>
        <div className="px-6 py-6 space-y-5">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <img src={previewSrc} alt="avatar" className="w-24 h-24 rounded-full border-2 object-cover" style={{ borderColor: 'var(--yuvist-elevated)' }} />
              <button type="button" onClick={() => fileRef.current?.click()} className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Icon name="Camera" size={24} className="text-white" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors" style={{ background: 'var(--yuvist-elevated)', border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-text)' }}>
                <Icon name="Upload" size={14} /> Загрузить фото
              </button>
              {avatarUrl && (
                <button type="button" onClick={() => setAvatarUrl('')} className="px-3 py-1.5 rounded-lg text-xs transition-colors hover:text-red-400" style={{ background: 'var(--yuvist-elevated)', border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-subtle)' }}>
                  Сбросить
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--yuvist-muted)' }}>Имя канала *</label>
            <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Моё имя" className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors" style={{ background: 'var(--yuvist-elevated)', border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-text)' }} />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--yuvist-muted)' }}>О канале</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Расскажите о своём канале..." rows={3} maxLength={300} className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none" style={{ background: 'var(--yuvist-elevated)', border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-text)' }} />
            <p className="text-xs mt-1 text-right" style={{ color: 'var(--yuvist-subtle)' }}>{bio.length}/300</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl text-sm transition-colors" style={{ border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-muted)' }}>Отмена</button>
            <button onClick={handleSave} disabled={!displayName.trim() || saved} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2">
              {saved ? <><Icon name="Check" size={16} /> Сохранено</> : 'Сохранить'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage({ onNavigate, onAuthOpen, onUpload }: ProfilePageProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { videos, subscriptions, deleteVideo } = useVideos();
  const [editOpen, setEditOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6" style={{ background: 'var(--yuvist-surface)' }}>
          <Icon name="User" size={36} style={{ color: 'var(--yuvist-subtle)' }} />
        </div>
        <h3 className="font-bold text-2xl mb-2" style={{ color: 'var(--yuvist-text)' }}>Мой профиль</h3>
        <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--yuvist-muted)' }}>Войдите, чтобы управлять своим каналом</p>
        <button onClick={onAuthOpen} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center gap-2">
          <Icon name="User" size={18} /> Войти
        </button>
      </div>
    );
  }

  const myVideos = videos.filter(v => v.authorId === user.id);
  const totalViews = myVideos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = myVideos.reduce((sum, v) => sum + v.likes.length, 0);
  const formatNum = (n: number) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}М`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}К`;
    return n.toString();
  };

  return (
    <div className="animate-fade-in">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6" style={{ height: '140px', background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 50%, #1a1a1a 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)' }} />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-6 -mt-12 px-4 md:px-6">
        <img src={user.avatar} alt={user.displayName} className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 flex-shrink-0 object-cover" style={{ borderColor: 'var(--yuvist-bg)' }} />
        <div className="flex-1 sm:pb-2 min-w-0">
          <h2 className="font-black text-xl md:text-2xl truncate" style={{ color: 'var(--yuvist-text)' }}>{user.displayName}</h2>
          <p className="text-sm" style={{ color: 'var(--yuvist-muted)' }}>@{user.username}</p>
          {user.bio && <p className="text-sm mt-1 max-w-md line-clamp-2" style={{ color: 'var(--yuvist-subtle)' }}>{user.bio}</p>}
          <p className="text-xs mt-1" style={{ color: 'var(--yuvist-subtle)' }}>
            {subscriptions.length} подписок · с {new Date(user.createdAt).toLocaleDateString('ru')}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setEditOpen(true)} className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-medium text-sm transition-colors" style={{ background: 'var(--yuvist-elevated)', border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-text)' }}>
            <Icon name="Pencil" size={15} /> <span className="hidden sm:inline">Редактировать</span>
          </button>
          <button onClick={onUpload} className="flex items-center gap-2 px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition-colors">
            <Icon name="Upload" size={15} /> <span className="hidden sm:inline">Загрузить</span>
          </button>
          <button onClick={() => onNavigate('settings')} className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-sm transition-colors" style={{ background: 'var(--yuvist-elevated)', border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-muted)' }}>
            <Icon name="Settings" size={15} />
          </button>
          <button onClick={logout} className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl text-sm transition-colors hover:text-red-400" style={{ background: 'var(--yuvist-elevated)', border: '1px solid var(--yuvist-elevated)', color: 'var(--yuvist-muted)' }}>
            <Icon name="LogOut" size={15} />
          </button>
        </div>
      </div>

      {/* Stats — только для хозяина канала */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 px-0">
        {[
          { label: 'Видео', value: myVideos.length, icon: 'Film', desc: 'опубликовано' },
          { label: 'Просмотры', value: formatNum(totalViews), icon: 'Eye', desc: 'всего' },
          { label: 'Лайки', value: formatNum(totalLikes), icon: 'ThumbsUp', desc: 'получено' },
          { label: 'Подписки', value: subscriptions.length, icon: 'Rss', desc: 'каналов' },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl p-4 md:p-5 text-center transition-colors" style={{ background: 'var(--yuvist-surface)', border: '1px solid var(--yuvist-elevated)' }}>
            <Icon name={stat.icon} size={22} className="text-red-600 mx-auto mb-2" />
            <p className="font-bold text-xl md:text-2xl" style={{ color: 'var(--yuvist-text)' }}>{stat.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--yuvist-subtle)' }}>{stat.label}</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--yuvist-subtle)' }}>{stat.desc}</p>
          </div>
        ))}
      </div>

      {/* My videos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-xl" style={{ color: 'var(--yuvist-text)' }}>Мои видео</h3>
          {myVideos.length > 0 && (
            <span className="text-sm" style={{ color: 'var(--yuvist-subtle)' }}>{myVideos.length} видео</span>
          )}
        </div>
        {myVideos.length === 0 ? (
          <div className="text-center py-12 rounded-2xl" style={{ border: '2px dashed var(--yuvist-elevated)' }}>
            <Icon name="Film" size={36} className="mx-auto mb-3" style={{ color: 'var(--yuvist-subtle)' }} />
            <p className="text-sm mb-4" style={{ color: 'var(--yuvist-muted)' }}>Вы ещё не загружали видео</p>
            <button onClick={onUpload} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-colors">
              Загрузить первое
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {myVideos.map(video => (
              <div key={video.id} className="relative group">
                <VideoCard video={video} onClick={id => onNavigate('player', id)} />
                {deletingId === video.id ? (
                  <div className="absolute inset-0 bg-black/80 rounded-xl flex flex-col items-center justify-center gap-3 animate-scale-in">
                    <p className="text-white text-sm font-medium text-center px-4">Удалить видео?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setDeletingId(null)} className="px-3 py-1.5 rounded-lg text-xs transition-colors" style={{ background: 'var(--yuvist-elevated)', color: 'var(--yuvist-muted)' }}>
                        Отмена
                      </button>
                      <button onClick={() => { deleteVideo(video.id); setDeletingId(null); }} className="px-3 py-1.5 bg-red-600 rounded-lg text-white text-xs hover:bg-red-700 transition-colors">
                        Удалить
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeletingId(video.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/70 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Icon name="Trash2" size={14} className="text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}
    </div>
  );
}