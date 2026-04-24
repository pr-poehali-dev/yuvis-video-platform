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
      <div className="w-full max-w-md bg-yuvist-surface border border-yuvist-elevated rounded-2xl overflow-hidden animate-scale-in shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-yuvist-elevated">
          <h2 className="text-white font-bold text-lg">Редактировать профиль</h2>
          <button onClick={onClose} className="text-yuvist-subtle hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          {/* Avatar upload */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <img
                src={previewSrc}
                alt="avatar"
                className="w-24 h-24 rounded-full border-2 border-yuvist-elevated object-cover"
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <Icon name="Camera" size={24} className="text-white" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-2 px-3 py-1.5 bg-yuvist-elevated hover:bg-yuvist-surface border border-yuvist-elevated rounded-lg text-yuvist-text text-xs transition-colors"
              >
                <Icon name="Upload" size={14} /> Загрузить фото
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={() => setAvatarUrl('')}
                  className="px-3 py-1.5 bg-yuvist-elevated hover:bg-red-900/30 border border-yuvist-elevated rounded-lg text-yuvist-subtle hover:text-red-400 text-xs transition-colors"
                >
                  Сбросить
                </button>
              )}
            </div>
          </div>

          <div>
            <label className="block text-yuvist-muted text-xs mb-1.5 font-medium">Имя канала *</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Моё имя"
              className="w-full bg-yuvist-elevated border border-yuvist-elevated focus:border-yuvist-red rounded-xl px-4 py-3 text-white placeholder-yuvist-subtle text-sm outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-yuvist-muted text-xs mb-1.5 font-medium">О канале</label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Расскажите о своём канале..."
              rows={3}
              maxLength={300}
              className="w-full bg-yuvist-elevated border border-yuvist-elevated focus:border-yuvist-red rounded-xl px-4 py-3 text-white placeholder-yuvist-subtle text-sm outline-none transition-colors resize-none"
            />
            <p className="text-yuvist-subtle text-xs mt-1 text-right">{bio.length}/300</p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-yuvist-elevated text-yuvist-muted hover:text-white transition-colors text-sm"
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              disabled={!displayName.trim() || saved}
              className="flex-1 py-3 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl font-semibold transition-all disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
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
        <div className="w-20 h-20 rounded-full bg-yuvist-surface flex items-center justify-center mb-6">
          <Icon name="User" size={36} className="text-yuvist-subtle" />
        </div>
        <h3 className="text-white font-bold text-2xl mb-2">Мой профиль</h3>
        <p className="text-yuvist-muted text-sm mb-8 max-w-xs">Войдите, чтобы управлять своим каналом</p>
        <button onClick={onAuthOpen} className="px-6 py-3 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl font-semibold transition-colors flex items-center gap-2">
          <Icon name="User" size={18} /> Войти
        </button>
      </div>
    );
  }

  const myVideos = videos.filter(v => v.authorId === user.id);
  const totalViews = myVideos.reduce((sum, v) => sum + v.views, 0);
  const totalLikes = myVideos.reduce((sum, v) => sum + v.likes.length, 0);
  const formatNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(0)}К` : n.toString();

  return (
    <div className="animate-fade-in">
      {/* Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-6" style={{ height: '160px', background: 'linear-gradient(135deg, #dc2626 0%, #7f1d1d 50%, #1a1a1a 100%)' }}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
      </div>

      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 mb-8 -mt-14 px-6">
        <img
          src={user.avatar}
          alt={user.displayName}
          className="w-24 h-24 rounded-full border-4 border-yuvist-bg flex-shrink-0 object-cover"
        />
        <div className="flex-1 sm:pb-2">
          <h2 className="text-white font-black text-2xl">{user.displayName}</h2>
          <p className="text-yuvist-muted text-sm">@{user.username}</p>
          {user.bio && <p className="text-yuvist-subtle text-sm mt-1 max-w-md">{user.bio}</p>}
          <p className="text-yuvist-subtle text-xs mt-1">
            {subscriptions.length} подписок · на платформе с {new Date(user.createdAt).toLocaleDateString('ru')}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-yuvist-elevated hover:bg-yuvist-surface text-white rounded-xl font-medium text-sm transition-colors border border-yuvist-elevated"
          >
            <Icon name="Pencil" size={15} /> Редактировать
          </button>
          <button onClick={onUpload} className="flex items-center gap-2 px-4 py-2 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl font-medium text-sm transition-colors">
            <Icon name="Upload" size={15} /> Загрузить
          </button>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-yuvist-elevated hover:bg-yuvist-surface text-yuvist-muted hover:text-red-400 rounded-xl text-sm transition-colors border border-yuvist-elevated">
            <Icon name="LogOut" size={15} /> Выйти
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Видео', value: myVideos.length, icon: 'Film' },
          { label: 'Просмотры', value: formatNum(totalViews), icon: 'Eye' },
          { label: 'Лайки', value: formatNum(totalLikes), icon: 'ThumbsUp' },
        ].map(stat => (
          <div key={stat.label} className="bg-yuvist-surface border border-yuvist-elevated rounded-2xl p-5 text-center">
            <Icon name={stat.icon} size={24} className="text-yuvist-red mx-auto mb-2" />
            <p className="text-white font-bold text-2xl">{stat.value}</p>
            <p className="text-yuvist-subtle text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* My videos */}
      <div>
        <h3 className="text-white font-bold text-xl mb-4">Мои видео</h3>
        {myVideos.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-yuvist-elevated rounded-2xl">
            <Icon name="Film" size={36} className="text-yuvist-subtle mx-auto mb-3" />
            <p className="text-yuvist-muted text-sm mb-4">Вы ещё не загружали видео</p>
            <button onClick={onUpload} className="px-5 py-2.5 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl text-sm font-medium transition-colors">
              Загрузить первое
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {myVideos.map(video => (
              <div key={video.id} className="relative group">
                <VideoCard video={video} onClick={id => onNavigate('player', id)} />
                {/* Delete button */}
                {deletingId === video.id ? (
                  <div className="absolute inset-0 bg-black/80 rounded-xl flex flex-col items-center justify-center gap-3 animate-scale-in">
                    <p className="text-white text-sm font-medium text-center px-4">Удалить видео?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1.5 bg-yuvist-elevated rounded-lg text-yuvist-muted text-xs hover:text-white transition-colors"
                      >
                        Отмена
                      </button>
                      <button
                        onClick={() => { deleteVideo(video.id); setDeletingId(null); }}
                        className="px-3 py-1.5 bg-yuvist-red rounded-lg text-white text-xs hover:bg-yuvist-red-hover transition-colors"
                      >
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
