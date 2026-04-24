import Icon from '@/components/ui/icon';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'home', label: 'Главная', icon: 'Home' },
  { id: 'catalog', label: 'Каталог', icon: 'LayoutGrid' },
  { id: 'subscriptions', label: 'Подписки', icon: 'Rss' },
  { id: 'history', label: 'История', icon: 'History' },
  { id: 'favorites', label: 'Избранное', icon: 'Bookmark' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 flex-col py-4 px-2 overflow-y-auto z-40"
        style={{ background: 'rgba(15,15,15,0.98)', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        <nav className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${currentPage === item.id
                  ? 'bg-yuvist-elevated text-white'
                  : 'text-yuvist-muted hover:bg-yuvist-surface hover:text-white'
                }`}
            >
              <Icon name={item.icon} size={20} className={currentPage === item.id ? 'text-yuvist-red' : ''} />
              {item.label}
            </button>
          ))}
        </nav>


      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
        style={{ background: 'rgba(15,15,15,0.98)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {navItems.slice(0, 5).map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all
              ${currentPage === item.id ? 'text-yuvist-red' : 'text-yuvist-subtle hover:text-white'}`}
          >
            <Icon name={item.icon} size={20} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}