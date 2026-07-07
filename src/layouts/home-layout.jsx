import { Outlet } from 'react-router-dom';

import AppHeader from '@/components/shared/app-header';

const HOME_NAV = [
  { key: 'home', label: 'Trang chủ', href: '#hero' },
  { key: 'about', label: 'Giới thiệu', href: '#about' },
  { key: 'jobs', label: 'Cơ hội', href: '#jobs' },
  { key: 'news', label: 'Tin tức', href: '#news' },
  { key: 'contact', label: 'Liên hệ', href: '#contact' },
];

export default function HomeLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <AppHeader navItems={HOME_NAV} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}