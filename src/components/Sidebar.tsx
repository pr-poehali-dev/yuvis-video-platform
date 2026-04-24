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
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

const mobileItems = navItems.slice(0, 5);

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 flex-col py-4 px-2 overflow-y-auto z-40 transition-colors duration-200"
        style={{ background: 'var(--yuvist-sidebar-bg)', borderRight: '1px solid var(--yuvist-nav-border)' }}
      >
        <nav className="space-y-1">
          {navItems.map(item => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: active ? 'var(--yuvist-elevated)' : 'transparent',
                  color: active ? 'var(--yuvist-text)' : 'var(--yuvist-muted)',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = 'var(--yuvist-elevated)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--yuvist-text)'; }}
                onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--yuvist-muted)'; } }}
              >
                <Icon name={item.icon} size={20} style={{ color: active ? '#dc2626' : 'inherit' }} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-1 py-1 transition-colors duration-200"
        style={{ background: 'var(--yuvist-sidebar-bg)', borderTop: '1px solid var(--yuvist-nav-border)' }}
      >
        {mobileItems.map(item => {
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-0"
              style={{ color: active ? '#dc2626' : 'var(--yuvist-subtle)' }}
            >
              <Icon name={item.icon} size={22} />
              <span className="text-[9px] font-medium leading-none truncate max-w-[48px]">{item.label}</span>
            </button>
          );
        })}
        {/* Settings на мобиле через "Ещё" */}
        <button
          onClick={() => onNavigate('settings')}
          className="flex flex-col items-center gap-0.5 px-2 py-2 rounded-xl transition-all min-w-0"
          style={{ color: currentPage === 'settings' ? '#dc2626' : 'var(--yuvist-subtle)' }}
        >
          <Icon name="Settings" size={22} />
          <span className="text-[9px] font-medium leading-none">Настройки</span>
        </button>
      </nav>
    </>
  );
}
