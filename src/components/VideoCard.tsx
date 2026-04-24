import { Video } from '@/context/VideoContext';
import Icon from '@/components/ui/icon';

interface VideoCardProps {
  video: Video;
  onClick: (id: string) => void;
  layout?: 'grid' | 'list';
}

function formatViews(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}М`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}К`;
  return n.toString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин. назад`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ч. назад`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days} дн. назад`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} мес. назад`;
  return `${Math.floor(months / 12)} г. назад`;
}

export default function VideoCard({ video, onClick, layout = 'grid' }: VideoCardProps) {
  if (layout === 'list') {
    return (
      <div
        className="flex gap-4 cursor-pointer group animate-fade-in"
        onClick={() => onClick(video.id)}
      >
        <div className="relative flex-shrink-0 w-48 aspect-video rounded-lg overflow-hidden bg-yuvist-elevated">
          {video.thumbnail ? (
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name="Play" size={32} className="text-yuvist-subtle" />
            </div>
          )}
          <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
            {video.duration || '0:00'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-yuvist-text font-semibold text-sm line-clamp-2 group-hover:text-white transition-colors">{video.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <img src={video.authorAvatar} alt={video.authorName} className="w-5 h-5 rounded-full" />
            <span className="text-yuvist-muted text-xs">{video.authorName}</span>
          </div>
          <p className="text-yuvist-subtle text-xs mt-1">
            {formatViews(video.views)} просмотров · {timeAgo(video.createdAt)}
          </p>
          <p className="text-yuvist-subtle text-xs mt-1 line-clamp-2">{video.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="cursor-pointer group animate-fade-in"
      onClick={() => onClick(video.id)}
    >
      <div className="relative aspect-video rounded-xl overflow-hidden bg-yuvist-elevated mb-3">
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-yuvist-surface">
            <Icon name="Play" size={40} className="text-yuvist-subtle" />
          </div>
        )}
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
          {video.duration || '0:00'}
        </span>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 w-12 h-12 rounded-full bg-black/70 flex items-center justify-center">
            <Icon name="Play" size={20} className="text-white ml-1" />
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <img src={video.authorAvatar} alt={video.authorName} className="w-9 h-9 rounded-full flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-yuvist-text font-semibold text-sm line-clamp-2 group-hover:text-white transition-colors leading-snug">{video.title}</h3>
          <p className="text-yuvist-muted text-xs mt-1 hover:text-white transition-colors">{video.authorName}</p>
          <p className="text-yuvist-subtle text-xs mt-0.5">
            {formatViews(video.views)} просм. · {timeAgo(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
