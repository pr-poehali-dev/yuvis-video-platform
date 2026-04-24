import { useAuth } from '@/context/AuthContext';
import { useVideos } from '@/context/VideoContext';
import VideoCard from '@/components/VideoCard';
import Icon from '@/components/ui/icon';

interface ProfilePageProps {
  onNavigate: (page: string, videoId?: string) => void;
  onAuthOpen: () => void;
  onUpload: () => void;
}

export default function ProfilePage({ onNavigate, onAuthOpen, onUpload }: ProfilePageProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { videos, subscriptions } = useVideos();

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
          className="w-24 h-24 rounded-full border-4 border-yuvist-bg flex-shrink-0"
        />
        <div className="flex-1 sm:pb-2">
          <h2 className="text-white font-black text-2xl">{user.displayName}</h2>
          <p className="text-yuvist-muted text-sm">@{user.username}</p>
          <p className="text-yuvist-subtle text-xs mt-1">
            {subscriptions.length} подписок · на платформе с {new Date(user.createdAt).toLocaleDateString('ru')}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onUpload} className="flex items-center gap-2 px-4 py-2 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl font-medium text-sm transition-colors">
            <Icon name="Upload" size={16} /> Загрузить
          </button>
          <button onClick={logout} className="flex items-center gap-2 px-4 py-2 bg-yuvist-elevated hover:bg-yuvist-surface text-yuvist-muted hover:text-red-400 rounded-xl text-sm transition-colors border border-yuvist-elevated">
            <Icon name="LogOut" size={16} /> Выйти
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
              <VideoCard key={video.id} video={video} onClick={id => onNavigate('player', id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
