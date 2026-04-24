import { useState } from 'react';
import { useVideos } from '@/context/VideoContext';
import VideoCard from '@/components/VideoCard';
import Icon from '@/components/ui/icon';

interface CatalogPageProps {
  onNavigate: (page: string, videoId?: string) => void;
}

const CATEGORIES = ['Музыка', 'Игры', 'Образование', 'Спорт', 'Кино', 'Технологии', 'Путешествия', 'Кулинария', 'Юмор', 'Прочее'];

const CATEGORY_ICONS: Record<string, string> = {
  'Музыка': 'Music', 'Игры': 'Gamepad2', 'Образование': 'GraduationCap',
  'Спорт': 'Trophy', 'Кино': 'Film', 'Технологии': 'Cpu',
  'Путешествия': 'Globe', 'Кулинария': 'ChefHat', 'Юмор': 'Smile', 'Прочее': 'Grid3x3',
};

export default function CatalogPage({ onNavigate }: CatalogPageProps) {
  const { videos } = useVideos();
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected ? videos.filter(v => v.category === selected) : [];

  if (selected) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-yuvist-muted hover:text-white transition-colors">
            <Icon name="ChevronLeft" size={20} />
            Каталог
          </button>
          <span className="text-yuvist-subtle">/</span>
          <span className="text-white font-semibold">{selected}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="VideoOff" size={48} className="text-yuvist-subtle mx-auto mb-4" />
            <p className="text-yuvist-muted">В этой категории пока нет видео</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {filtered.map(video => (
              <VideoCard key={video.id} video={video} onClick={id => onNavigate('player', id)} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-white font-bold text-2xl mb-6">Каталог</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {CATEGORIES.map(cat => {
          const count = videos.filter(v => v.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className="flex flex-col items-center gap-3 p-6 bg-yuvist-surface hover:bg-yuvist-elevated border border-yuvist-elevated hover:border-yuvist-red rounded-2xl transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-yuvist-elevated group-hover:bg-yuvist-red/20 flex items-center justify-center transition-colors">
                <Icon name={CATEGORY_ICONS[cat] || 'Play'} size={24} className="text-yuvist-muted group-hover:text-yuvist-red transition-colors" />
              </div>
              <div className="text-center">
                <p className="text-white font-medium text-sm">{cat}</p>
                <p className="text-yuvist-subtle text-xs mt-0.5">{count} видео</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
