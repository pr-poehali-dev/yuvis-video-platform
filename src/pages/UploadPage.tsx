import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useVideos } from '@/context/VideoContext';
import Icon from '@/components/ui/icon';

interface UploadPageProps {
  onClose: () => void;
  onAuthOpen: () => void;
}

const CATEGORIES = ['Музыка', 'Игры', 'Образование', 'Спорт', 'Кино', 'Технологии', 'Путешествия', 'Кулинария', 'Юмор', 'Прочее'];

export default function UploadPage({ onClose, onAuthOpen }: UploadPageProps) {
  const { user, isAuthenticated } = useAuth();
  const { addVideo } = useVideos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Прочее');
  const [tags, setTags] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [step, setStep] = useState<'upload' | 'details' | 'done'>('upload');
  const inputRef = useRef<HTMLInputElement>(null);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="w-full max-w-sm bg-yuvist-surface border border-yuvist-elevated rounded-2xl p-8 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-yuvist-elevated flex items-center justify-center mx-auto mb-4">
            <Icon name="Lock" size={28} className="text-yuvist-subtle" />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Нужен аккаунт</h3>
          <p className="text-yuvist-muted text-sm mb-6">Войдите, чтобы загружать видео</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-yuvist-elevated text-yuvist-muted hover:text-white transition-colors text-sm">Отмена</button>
            <button onClick={() => { onClose(); onAuthOpen(); }} className="flex-1 py-2.5 rounded-xl bg-yuvist-red hover:bg-yuvist-red-hover text-white font-semibold transition-colors text-sm">Войти</button>
          </div>
        </div>
      </div>
    );
  }

  const handleVideoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
    const video = document.createElement('video');
    video.src = url;
    video.onloadedmetadata = () => {
      const d = Math.floor(video.duration);
      const m = Math.floor(d / 60);
      const s = d % 60;
      setDuration(`${m}:${s.toString().padStart(2, '0')}`);
    };
    setStep('details');
  };

  const handlePublish = () => {
    if (!title.trim() || !videoUrl) return;
    addVideo({
      title: title.trim(),
      description: description.trim(),
      url: videoUrl,
      thumbnail: thumbnailUrl,
      authorId: user!.id,
      authorName: user!.displayName,
      authorAvatar: user!.avatar,
      category,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      duration,
    });
    setStep('done');
  };

  if (step === 'done') {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
        <div className="w-full max-w-sm bg-yuvist-surface border border-yuvist-elevated rounded-2xl p-8 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-green-400" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Видео опубликовано!</h3>
          <p className="text-yuvist-muted text-sm mb-6">«{title}» теперь доступно всем зрителям</p>
          <button onClick={onClose} className="w-full py-3 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl font-semibold transition-colors">
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-2xl bg-yuvist-surface border border-yuvist-elevated rounded-2xl overflow-hidden animate-scale-in shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-yuvist-elevated sticky top-0 bg-yuvist-surface z-10">
          <h2 className="text-white font-bold text-lg">{step === 'upload' ? 'Загрузить видео' : 'Детали видео'}</h2>
          <button onClick={onClose} className="text-yuvist-subtle hover:text-white transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        {step === 'upload' && (
          <div className="px-6 py-10">
            <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoInput} />
            <div
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-yuvist-elevated hover:border-yuvist-red rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 hover:bg-yuvist-red/5 group"
            >
              <div className="w-20 h-20 rounded-full bg-yuvist-elevated flex items-center justify-center mx-auto mb-4 group-hover:bg-yuvist-red/20 transition-colors">
                <Icon name="Upload" size={36} className="text-yuvist-subtle group-hover:text-yuvist-red transition-colors" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Выберите файл</h3>
              <p className="text-yuvist-muted text-sm mb-1">Перетащите видео или нажмите</p>
              <p className="text-yuvist-subtle text-xs">MP4, WebM, AVI · До 2 ГБ</p>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="px-6 py-6 space-y-5">
            <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
              <Icon name="CheckCircle" size={20} className="text-green-400 flex-shrink-0" />
              <span className="text-green-400 text-sm">Видео загружено {duration && `· ${duration}`}</span>
            </div>

            <div>
              <label className="block text-yuvist-muted text-xs mb-1.5 font-medium">Название *</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Введите название видео"
                className="w-full bg-yuvist-elevated border border-yuvist-elevated focus:border-yuvist-red rounded-xl px-4 py-3 text-white placeholder-yuvist-subtle text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-yuvist-muted text-xs mb-1.5 font-medium">Описание</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Расскажите о видео..."
                rows={3}
                className="w-full bg-yuvist-elevated border border-yuvist-elevated focus:border-yuvist-red rounded-xl px-4 py-3 text-white placeholder-yuvist-subtle text-sm outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-yuvist-muted text-xs mb-1.5 font-medium">Ссылка на превью (необязательно)</label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={e => setThumbnailUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-yuvist-elevated border border-yuvist-elevated focus:border-yuvist-red rounded-xl px-4 py-3 text-white placeholder-yuvist-subtle text-sm outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-yuvist-muted text-xs mb-1.5 font-medium">Категория</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-yuvist-elevated border border-yuvist-elevated focus:border-yuvist-red rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-yuvist-muted text-xs mb-1.5 font-medium">Теги (через запятую)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  placeholder="тег1, тег2"
                  className="w-full bg-yuvist-elevated border border-yuvist-elevated focus:border-yuvist-red rounded-xl px-4 py-3 text-white placeholder-yuvist-subtle text-sm outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setStep('upload')} className="flex-1 py-3 rounded-xl border border-yuvist-elevated text-yuvist-muted hover:text-white transition-colors text-sm">
                Назад
              </button>
              <button
                onClick={handlePublish}
                disabled={!title.trim()}
                className="flex-1 py-3 bg-yuvist-red hover:bg-yuvist-red-hover text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Опубликовать
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
