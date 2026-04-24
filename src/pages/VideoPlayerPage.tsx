import { useEffect, useRef, useState } from 'react';
import { useVideos } from '@/context/VideoContext';
import { useAuth } from '@/context/AuthContext';
import VideoCard from '@/components/VideoCard';
import Icon from '@/components/ui/icon';

interface VideoPlayerPageProps {
  videoId: string;
  onNavigate: (page: string, videoId?: string) => void;
  onAuthOpen: () => void;
}

function formatViews(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}М`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}К`;
  return n.toString();
}

export default function VideoPlayerPage({ videoId, onNavigate, onAuthOpen }: VideoPlayerPageProps) {
  const { getVideoById, likeVideo, dislikeVideo, addView, addToHistory, toggleFavorite, favorites, toggleSubscription, subscriptions, videos } = useVideos();
  const { user, isAuthenticated } = useAuth();
  const [viewed, setViewed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const video = getVideoById(videoId);

  useEffect(() => {
    if (!video || viewed) return;
    addView(videoId);
    addToHistory(videoId);
    setViewed(true);
  }, [video, videoId, viewed, addView, addToHistory]);

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Icon name="VideoOff" size={48} className="text-yuvist-subtle mb-4" />
        <h3 className="text-white font-semibold text-lg mb-2">Видео не найдено</h3>
        <button onClick={() => onNavigate('home')} className="text-yuvist-red hover:underline text-sm">На главную</button>
      </div>
    );
  }

  const isLiked = user ? video.likes.includes(user.id) : false;
  const isDisliked = user ? video.dislikes.includes(user.id) : false;
  const isFavorite = favorites.includes(videoId);
  const isSubscribed = subscriptions.includes(video.authorId);

  const handleLike = () => { if (!isAuthenticated) { onAuthOpen(); return; } likeVideo(videoId, user!.id); };
  const handleDislike = () => { if (!isAuthenticated) { onAuthOpen(); return; } dislikeVideo(videoId, user!.id); };

  const related = videos.filter(v => v.id !== videoId && v.category === video.category).slice(0, 6);
  const others = videos.filter(v => v.id !== videoId && !related.find(r => r.id === v.id)).slice(0, 6);
  const sidebar = [...related, ...others].slice(0, 10);

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Player */}
        <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-4">
          <video
            ref={videoRef}
            src={video.url}
            poster={video.thumbnail}
            controls
            className="w-full h-full"
            autoPlay
          />
        </div>

        {/* Title */}
        <h1 className="text-white font-bold text-xl mb-3 leading-tight">{video.title}</h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <img src={video.authorAvatar} alt={video.authorName} className="w-10 h-10 rounded-full cursor-pointer hover:opacity-80 transition-opacity" />
            <div>
              <p className="text-white font-semibold text-sm">{video.authorName}</p>
            </div>
            <button
              onClick={() => { if (!isAuthenticated) { onAuthOpen(); return; } toggleSubscription(video.authorId); }}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${isSubscribed ? 'bg-yuvist-elevated text-yuvist-muted hover:bg-red-900/40 hover:text-red-400' : 'bg-white text-black hover:bg-gray-200'}`}
            >
              {isSubscribed ? 'Отписаться' : 'Подписаться'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Likes */}
            <div className="flex items-center rounded-full overflow-hidden bg-yuvist-elevated border border-yuvist-elevated">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-yuvist-surface ${isLiked ? 'text-yuvist-red' : 'text-yuvist-text'}`}
              >
                <Icon name="ThumbsUp" size={16} />
                <span>{video.likes.length}</span>
              </button>
              <div className="w-px h-5 bg-yuvist-elevated" />
              <button
                onClick={handleDislike}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:bg-yuvist-surface ${isDisliked ? 'text-blue-400' : 'text-yuvist-text'}`}
              >
                <Icon name="ThumbsDown" size={16} />
                <span>{video.dislikes.length}</span>
              </button>
            </div>

            {/* Favorite */}
            <button
              onClick={() => { if (!isAuthenticated) { onAuthOpen(); return; } toggleFavorite(videoId); }}
              className={`flex items-center gap-2 px-4 py-2 bg-yuvist-elevated rounded-full text-sm font-medium transition-colors hover:bg-yuvist-surface ${isFavorite ? 'text-yellow-400' : 'text-yuvist-text'}`}
            >
              <Icon name={isFavorite ? 'BookmarkCheck' : 'Bookmark'} size={16} />
              {isFavorite ? 'Сохранено' : 'Сохранить'}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-yuvist-surface rounded-xl p-4">
          <p className="text-yuvist-muted text-sm mb-1">
            <span className="text-white font-medium">{formatViews(video.views)} просмотров</span>
            {video.category && <span className="ml-2 text-yuvist-subtle">· {video.category}</span>}
          </p>
          {video.description && <p className="text-yuvist-muted text-sm mt-2 whitespace-pre-wrap">{video.description}</p>}
          {video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {video.tags.map(t => (
                <span key={t} className="text-xs text-yuvist-red bg-yuvist-red/10 px-2 py-1 rounded-full">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      {sidebar.length > 0 && (
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <h3 className="text-white font-semibold mb-4">Похожие видео</h3>
          <div className="space-y-4">
            {sidebar.map(v => (
              <VideoCard key={v.id} video={v} onClick={id => onNavigate('player', id)} layout="list" />
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}
