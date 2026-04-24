import { useVideos } from '@/context/VideoContext';
import { useAuth } from '@/context/AuthContext';
import VideoCard from '@/components/VideoCard';
import Icon from '@/components/ui/icon';

interface FavoritesPageProps {
  onNavigate: (page: string, videoId?: string) => void;
  onAuthOpen: () => void;
}

export default function FavoritesPage({ onNavigate, onAuthOpen }: FavoritesPageProps) {
  const { favorites, getVideoById } = useVideos();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-yuvist-surface flex items-center justify-center mb-6">
          <Icon name="Bookmark" size={36} className="text-yuvist-subtle" />
        </div>
        <h3 className="text-white font-bold text-2xl mb-2">Избранное</h3>
        <p className="text-yuvist-muted text-sm mb-8 max-w-xs">Войдите, чтобы сохранять видео в избранное</p>
        <button onClick={onAuthOpen} className="px-6 py-3 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl font-semibold transition-colors flex items-center gap-2">
          <Icon name="User" size={18} /> Войти
        </button>
      </div>
    );
  }

  const favVideos = favorites.map(id => getVideoById(id)).filter((v): v is NonNullable<typeof v> => v !== undefined);

  if (favVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-yuvist-surface flex items-center justify-center mb-6">
          <Icon name="Bookmark" size={36} className="text-yuvist-subtle" />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">Избранное пусто</h3>
        <p className="text-yuvist-muted text-sm">Сохраняйте понравившиеся видео</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-2xl">Избранное</h2>
        <span className="text-yuvist-subtle text-sm">{favVideos.length} видео</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {favVideos.map(video => (
          <VideoCard key={video.id} video={video} onClick={id => onNavigate('player', id)} />
        ))}
      </div>
    </div>
  );
}
