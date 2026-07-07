import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Briefcase, Building2, LayoutDashboard, LogOut, Menu, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { useUiStore } from '@/stores/ui-store';
import { APP_NAME } from '@/constants';
import { NAV_ITEMS, ROUTES } from '@/configs/routes';
import { hasAllowedRole } from '@/lib/authorization';
import { cn } from '@/lib/utils';

const ICONS = {
  LayoutDashboard,
  Building2,
  Briefcase
};

export default function MainLayout() {
  const { user, clearAuth } = useAuth();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const navigate = useNavigate();
  const visibleNavItems = NAV_ITEMS.filter((item) =>
    hasAllowedRole(user?.role, item.allowedRoles),
  );

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside
        className={cn(
          'flex flex-col border-r bg-background transition-all duration-200',
          sidebarOpen ? 'w-64' : 'w-16',
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-sm font-bold">FE</span>
          </div>
          {sidebarOpen && <span className="font-semibold">{APP_NAME}</span>}
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {visibleNavItems.map((item) => {
            const Icon = ICONS[item.icon] || Building2;
            return (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.fullName || user?.username || 'User'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user?.email || 'Tài khoản'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
