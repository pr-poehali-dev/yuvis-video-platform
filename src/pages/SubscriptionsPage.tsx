import { useVideos } from '@/context/VideoContext';
import { useAuth } from '@/context/AuthContext';
import VideoCard from '@/components/VideoCard';
import Icon from '@/components/ui/icon';

interface SubscriptionsPageProps {
  onNavigate: (page: string, videoId?: string) => void;
  onAuthOpen: () => void;
}

export default function SubscriptionsPage({ onNavigate, onAuthOpen }: SubscriptionsPageProps) {
  const { subscriptions, videos } = useVideos();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-yuvist-surface flex items-center justify-center mb-6">
          <Icon name="Rss" size={36} className="text-yuvist-subtle" />
        </div>
        <h3 className="text-white font-bold text-2xl mb-2">Подписки</h3>
        <p className="text-yuvist-muted text-sm mb-8 max-w-xs">Войдите, чтобы видеть видео от авторов, на которых вы подписаны</p>
        <button onClick={onAuthOpen} className="px-6 py-3 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl font-semibold transition-colors flex items-center gap-2">
          <Icon name="User" size={18} /> Войти
        </button>
      </div>
    );
  }

  const subVideos = videos.filter(v => subscriptions.includes(v.authorId))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (subscriptions.length === 0 || subVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-yuvist-surface flex items-center justify-center mb-6">
          <Icon name="Rss" size={36} className="text-yuvist-subtle" />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">Нет подписок</h3>
        <p className="text-yuvist-muted text-sm max-w-xs">Подпишитесь на авторов, чтобы их видео появлялись здесь</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-white font-bold text-2xl mb-6">Подписки</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
        {subVideos.map(video => (
          <VideoCard key={video.id} video={video} onClick={id => onNavigate('player', id)} />
        ))}
      </div>
    </div>
  );
}
