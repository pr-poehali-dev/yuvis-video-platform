import { useState } from 'react';
import { useVideos } from '@/context/VideoContext';
import VideoCard from '@/components/VideoCard';
import Icon from '@/components/ui/icon';

interface HomePageProps {
  onNavigate: (page: string, videoId?: string) => void;
  onUpload: () => void;
}

const FILTERS = ['Все', 'Музыка', 'Игры', 'Образование', 'Спорт', 'Кино', 'Технологии', 'Путешествия', 'Юмор'];

export default function HomePage({ onNavigate, onUpload }: HomePageProps) {
  const { videos } = useVideos();
  const [activeFilter, setActiveFilter] = useState('Все');

  const filtered = activeFilter === 'Все' ? videos : videos.filter(v => v.category === activeFilter);

  return (
    <div className="animate-fade-in">
      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${activeFilter === f
                ? 'bg-white text-black'
                : 'bg-yuvist-elevated text-yuvist-text hover:bg-yuvist-surface'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
          <div className="w-24 h-24 rounded-full bg-yuvist-surface flex items-center justify-center mb-6">
            <Icon name="Film" size={40} className="text-yuvist-subtle" />
          </div>
          <h3 className="text-white font-bold text-2xl mb-2">Пока нет видео</h3>
          <p className="text-yuvist-muted text-sm mb-8 max-w-xs">
            {activeFilter === 'Все' ? 'Станьте первым автором — загрузите своё видео!' : `Нет видео в категории «${activeFilter}»`}
          </p>
          {activeFilter === 'Все' && (
            <button
              onClick={onUpload}
              className="flex items-center gap-2 px-6 py-3 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl font-semibold transition-colors"
            >
              <Icon name="Upload" size={18} />
              Загрузить первое видео
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
          {filtered.map((video, i) => (
            <div key={video.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <VideoCard video={video} onClick={id => onNavigate('player', id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
