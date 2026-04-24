import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import HomePage from '@/pages/HomePage';
import CatalogPage from '@/pages/CatalogPage';
import SearchPage from '@/pages/SearchPage';
import SubscriptionsPage from '@/pages/SubscriptionsPage';
import HistoryPage from '@/pages/HistoryPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ProfilePage from '@/pages/ProfilePage';
import VideoPlayerPage from '@/pages/VideoPlayerPage';
import UploadPage from '@/pages/UploadPage';
import AuthPage from '@/pages/AuthPage';

type Page = 'home' | 'catalog' | 'search' | 'subscriptions' | 'history' | 'favorites' | 'profile' | 'player';

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const handleNavigate = (page: string, videoId?: string) => {
    setCurrentPage(page as Page);
    if (videoId) setCurrentVideoId(videoId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setCurrentPage('search');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onUpload={() => setShowUpload(true)} />;
      case 'catalog':
        return <CatalogPage onNavigate={handleNavigate} />;
      case 'search':
        return <SearchPage query={searchQuery} onNavigate={handleNavigate} />;
      case 'subscriptions':
        return <SubscriptionsPage onNavigate={handleNavigate} onAuthOpen={() => setShowAuth(true)} />;
      case 'history':
        return <HistoryPage onNavigate={handleNavigate} onAuthOpen={() => setShowAuth(true)} />;
      case 'favorites':
        return <FavoritesPage onNavigate={handleNavigate} onAuthOpen={() => setShowAuth(true)} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} onAuthOpen={() => setShowAuth(true)} onUpload={() => setShowUpload(true)} />;
      case 'player':
        return currentVideoId
          ? <VideoPlayerPage videoId={currentVideoId} onNavigate={handleNavigate} onAuthOpen={() => setShowAuth(true)} />
          : <HomePage onNavigate={handleNavigate} onUpload={() => setShowUpload(true)} />;
      default:
        return <HomePage onNavigate={handleNavigate} onUpload={() => setShowUpload(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-yuvist-bg text-yuvist-text font-golos">
      <Navbar
        onSearch={handleSearch}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        onUpload={() => setShowUpload(true)}
        onAuthOpen={() => setShowAuth(true)}
      />
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />

      <main className="md:ml-56 pt-14 pb-20 md:pb-6 px-4 md:px-6 lg:px-8 min-h-screen">
        <div className="max-w-screen-2xl mx-auto py-6">
          {renderPage()}
        </div>
      </main>

      {showUpload && (
        <UploadPage
          onClose={() => setShowUpload(false)}
          onAuthOpen={() => { setShowUpload(false); setShowAuth(true); }}
        />
      )}
      {showAuth && <AuthPage onClose={() => setShowAuth(false)} />}
    </div>
  );
}
