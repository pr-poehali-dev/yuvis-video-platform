import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  views: number;
  likes: string[];
  dislikes: string[];
  category: string;
  tags: string[];
  duration: string;
  createdAt: string;
}

interface VideoContextType {
  videos: Video[];
  addVideo: (video: Omit<Video, 'id' | 'views' | 'likes' | 'dislikes' | 'createdAt'>) => void;
  likeVideo: (videoId: string, userId: string) => void;
  dislikeVideo: (videoId: string, userId: string) => void;
  addView: (videoId: string) => void;
  getVideoById: (id: string) => Video | undefined;
  history: string[];
  addToHistory: (videoId: string) => void;
  favorites: string[];
  toggleFavorite: (videoId: string) => void;
  subscriptions: string[];
  toggleSubscription: (authorId: string) => void;
}

const VideoContext = createContext<VideoContextType | null>(null);

const VIDEOS_KEY = 'yuvist_videos';
const HISTORY_KEY = 'yuvist_history';
const FAVORITES_KEY = 'yuvist_favorites';
const SUBS_KEY = 'yuvist_subscriptions';

const load = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || '') ?? fallback; }
  catch (_e) { return fallback; }
};

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>(() => load(VIDEOS_KEY, []));
  const [history, setHistory] = useState<string[]>(() => load(HISTORY_KEY, []));
  const [favorites, setFavorites] = useState<string[]>(() => load(FAVORITES_KEY, []));
  const [subscriptions, setSubscriptions] = useState<string[]>(() => load(SUBS_KEY, []));

  useEffect(() => { localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem(SUBS_KEY, JSON.stringify(subscriptions)); }, [subscriptions]);

  const addVideo = (v: Omit<Video, 'id' | 'views' | 'likes' | 'dislikes' | 'createdAt'>) => {
    const newVideo: Video = { ...v, id: Date.now().toString(), views: 0, likes: [], dislikes: [], createdAt: new Date().toISOString() };
    setVideos(prev => [newVideo, ...prev]);
  };

  const likeVideo = (videoId: string, userId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id !== videoId) return v;
      const liked = v.likes.includes(userId);
      return {
        ...v,
        likes: liked ? v.likes.filter(id => id !== userId) : [...v.likes, userId],
        dislikes: v.dislikes.filter(id => id !== userId),
      };
    }));
  };

  const dislikeVideo = (videoId: string, userId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id !== videoId) return v;
      const disliked = v.dislikes.includes(userId);
      return {
        ...v,
        dislikes: disliked ? v.dislikes.filter(id => id !== userId) : [...v.dislikes, userId],
        likes: v.likes.filter(id => id !== userId),
      };
    }));
  };

  const addView = (videoId: string) => {
    setVideos(prev => prev.map(v => v.id === videoId ? { ...v, views: v.views + 1 } : v));
  };

  const getVideoById = (id: string) => videos.find(v => v.id === id);

  const addToHistory = (videoId: string) => {
    setHistory(prev => [videoId, ...prev.filter(id => id !== videoId)].slice(0, 100));
  };

  const toggleFavorite = (videoId: string) => {
    setFavorites(prev => prev.includes(videoId) ? prev.filter(id => id !== videoId) : [videoId, ...prev]);
  };

  const toggleSubscription = (authorId: string) => {
    setSubscriptions(prev => prev.includes(authorId) ? prev.filter(id => id !== authorId) : [authorId, ...prev]);
  };

  return (
    <VideoContext.Provider value={{ videos, addVideo, likeVideo, dislikeVideo, addView, getVideoById, history, addToHistory, favorites, toggleFavorite, subscriptions, toggleSubscription }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error('useVideos must be used within VideoProvider');
  return ctx;
}
