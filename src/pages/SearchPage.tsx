import { useState, useEffect } from 'react';
import { useVideos } from '@/context/VideoContext';
import VideoCard from '@/components/VideoCard';
import Icon from '@/components/ui/icon';

interface SearchPageProps {
  query: string;
  onNavigate: (page: string, videoId?: string) => void;
}

export default function SearchPage({ query, onNavigate }: SearchPageProps) {
  const { videos } = useVideos();
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  const results = query
    ? videos.filter(v =>
        v.title.toLowerCase().includes(query.toLowerCase()) ||
        v.description.toLowerCase().includes(query.toLowerCase()) ||
        v.authorName.toLowerCase().includes(query.toLowerCase()) ||
        v.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
        v.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">
            {query ? `Результаты: «${query}»` : 'Поиск'}
          </h2>
          {results.length > 0 && (
            <p className="text-yuvist-subtle text-sm mt-1">Найдено {results.length} видео</p>
          )}
        </div>
        {results.length > 0 && (
          <div className="flex items-center gap-1 bg-yuvist-elevated rounded-lg p-1">
            <button onClick={() => setLayout('grid')} className={`p-2 rounded-md transition-colors ${layout === 'grid' ? 'bg-yuvist-surface text-white' : 'text-yuvist-subtle hover:text-white'}`}>
              <Icon name="LayoutGrid" size={16} />
            </button>
            <button onClick={() => setLayout('list')} className={`p-2 rounded-md transition-colors ${layout === 'list' ? 'bg-yuvist-surface text-white' : 'text-yuvist-subtle hover:text-white'}`}>
              <Icon name="List" size={16} />
            </button>
          </div>
        )}
      </div>

      {!query ? (
        <div className="text-center py-20">
          <Icon name="Search" size={48} className="text-yuvist-subtle mx-auto mb-4" />
          <p className="text-yuvist-muted">Введите запрос в строке поиска</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <Icon name="SearchX" size={48} className="text-yuvist-subtle mx-auto mb-4" />
          <h3 className="text-white font-semibold text-lg mb-2">Ничего не найдено</h3>
          <p className="text-yuvist-muted text-sm">Попробуйте другие ключевые слова</p>
        </div>
      ) : layout === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {results.map(video => (
            <VideoCard key={video.id} video={video} onClick={id => onNavigate('player', id)} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {results.map(video => (
            <VideoCard key={video.id} video={video} onClick={id => onNavigate('player', id)} layout="list" />
          ))}
        </div>
      )}
    </div>
  );
}
