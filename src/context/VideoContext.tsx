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

export interface Comment {
  id: string;
  videoId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

interface VideoContextType {
  videos: Video[];
  addVideo: (video: Omit<Video, 'id' | 'views' | 'likes' | 'dislikes' | 'createdAt'>) => void;
  deleteVideo: (videoId: string) => void;
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
  comments: Comment[];
  addComment: (videoId: string, authorId: string, authorName: string, authorAvatar: string, text: string) => void;
  deleteComment: (commentId: string) => void;
  getCommentsByVideoId: (videoId: string) => Comment[];
}

const VideoContext = createContext<VideoContextType | null>(null);

const VIDEOS_KEY = 'yuvist_videos';
const HISTORY_KEY = 'yuvist_history';
const FAVORITES_KEY = 'yuvist_favorites';
const SUBS_KEY = 'yuvist_subscriptions';
const COMMENTS_KEY = 'yuvist_comments';

const load = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || '') ?? fallback; }
  catch (_e) { return fallback; }
};

export function VideoProvider({ children }: { children: ReactNode }) {
  const [videos, setVideos] = useState<Video[]>(() => load(VIDEOS_KEY, []));
  const [history, setHistory] = useState<string[]>(() => load(HISTORY_KEY, []));
  const [favorites, setFavorites] = useState<string[]>(() => load(FAVORITES_KEY, []));
  const [subscriptions, setSubscriptions] = useState<string[]>(() => load(SUBS_KEY, []));
  const [comments, setComments] = useState<Comment[]>(() => load(COMMENTS_KEY, []));

  useEffect(() => { localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem(SUBS_KEY, JSON.stringify(subscriptions)); }, [subscriptions]);
  useEffect(() => { localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments)); }, [comments]);

  const addVideo = (v: Omit<Video, 'id' | 'views' | 'likes' | 'dislikes' | 'createdAt'>) => {
    const newVideo: Video = { ...v, id: Date.now().toString(), views: 0, likes: [], dislikes: [], createdAt: new Date().toISOString() };
    setVideos(prev => [newVideo, ...prev]);
  };

  const deleteVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
    setHistory(prev => prev.filter(id => id !== videoId));
    setFavorites(prev => prev.filter(id => id !== videoId));
    setComments(prev => prev.filter(c => c.videoId !== videoId));
  };

  const likeVideo = (videoId: string, userId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id !== videoId) return v;
      const liked = v.likes.includes(userId);
      return { ...v, likes: liked ? v.likes.filter(id => id !== userId) : [...v.likes, userId], dislikes: v.dislikes.filter(id => id !== userId) };
    }));
  };

  const dislikeVideo = (videoId: string, userId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id !== videoId) return v;
      const disliked = v.dislikes.includes(userId);
      return { ...v, dislikes: disliked ? v.dislikes.filter(id => id !== userId) : [...v.dislikes, userId], likes: v.likes.filter(id => id !== userId) };
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

  const addComment = (videoId: string, authorId: string, authorName: string, authorAvatar: string, text: string) => {
    const c: Comment = { id: Date.now().toString(), videoId, authorId, authorName, authorAvatar, text, createdAt: new Date().toISOString() };
    setComments(prev => [c, ...prev]);
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  const getCommentsByVideoId = (videoId: string) => comments.filter(c => c.videoId === videoId);

  return (
    <VideoContext.Provider value={{ videos, addVideo, deleteVideo, likeVideo, dislikeVideo, addView, getVideoById, history, addToHistory, favorites, toggleFavorite, subscriptions, toggleSubscription, comments, addComment, deleteComment, getCommentsByVideoId }}>
      {children}
    </VideoContext.Provider>
  );
}

export function useVideos() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error('useVideos must be used within VideoProvider');
  return ctx;
}
