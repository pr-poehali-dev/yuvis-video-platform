import { useVideos } from '@/context/VideoContext';
import { useAuth } from '@/context/AuthContext';
import VideoCard from '@/components/VideoCard';
import Icon from '@/components/ui/icon';

interface HistoryPageProps {
  onNavigate: (page: string, videoId?: string) => void;
  onAuthOpen: () => void;
}

export default function HistoryPage({ onNavigate, onAuthOpen }: HistoryPageProps) {
  const { history, getVideoById } = useVideos();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-yuvist-surface flex items-center justify-center mb-6">
          <Icon name="History" size={36} className="text-yuvist-subtle" />
        </div>
        <h3 className="text-white font-bold text-2xl mb-2">История</h3>
        <p className="text-yuvist-muted text-sm mb-8 max-w-xs">Войдите, чтобы сохранялась история просмотров</p>
        <button onClick={onAuthOpen} className="px-6 py-3 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl font-semibold transition-colors flex items-center gap-2">
          <Icon name="User" size={18} /> Войти
        </button>
      </div>
    );
  }

  const historyVideos = history.map(id => getVideoById(id)).filter(Boolean) as ReturnType<typeof getVideoById>[];
  const defined = historyVideos.filter(v => v !== undefined) as NonNullable<typeof historyVideos[0]>[];

  if (defined.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-yuvist-surface flex items-center justify-center mb-6">
          <Icon name="History" size={36} className="text-yuvist-subtle" />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">История пуста</h3>
        <p className="text-yuvist-muted text-sm">Смотрите видео — они сохранятся здесь</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-2xl">История просмотров</h2>
        <span className="text-yuvist-subtle text-sm">{defined.length} видео</span>
      </div>
      <div className="space-y-4">
        {defined.map(video => (
          <VideoCard key={video.id} video={video} onClick={id => onNavigate('player', id)} layout="list" />
        ))}
      </div>
    </div>
  );
}
