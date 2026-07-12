import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Sparkles,
  User,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { LogoutLoadingOverlay } from '@/components/shared/logout-loading-overlay';
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
import { APP_NAME, ROLES } from '@/constants';
import { NAV_ITEMS, ROUTES } from '@/configs/routes';
import { hasAllowedRole } from '@/lib/authorization';
import { cn } from '@/lib/utils';

const ICONS = {
  LayoutDashboard,
  Building2,
  Briefcase,
  ClipboardList,
  Package,
};

function getMembershipClass(membershipName) {
  const normalizedName = membershipName?.trim().toUpperCase();

  if (normalizedName === 'PRO') {
    return 'border border-slate-300 bg-gradient-to-r from-slate-100 via-white to-slate-200 text-slate-700 shadow-sm';
  }

  if (normalizedName === 'PREMIUM') {
    return 'border border-violet-300 bg-gradient-to-r from-slate-200 via-violet-100 to-slate-300 text-violet-900 shadow-sm ring-1 ring-violet-200/70';
  }

  return 'bg-primary/10 text-primary';
}

export default function MainLayout() {
  const { user, clearAuth } = useAuth();
  const sidebarOpen = useUiStore((s) => s.sidebarOpen);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const visibleNavItems = NAV_ITEMS.filter((item) =>
    hasAllowedRole(user?.role, item.allowedRoles),
  );

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    setLoggingOut(true);
    window.setTimeout(() => {
      setLoggingOut(false);
      clearAuth();
      navigate(ROUTES.HOME, { replace: true });
    }, 1500);
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
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="space-y-1">
                <div>{user?.fullName || user?.username || 'Tài khoản'}</div>
                <div className="truncate text-xs font-normal text-muted-foreground">
                  {user?.username}
                </div>
                {user?.role === ROLES.CANDIDATE && (
                  <div className="flex items-center justify-between pt-2 text-xs font-normal">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 font-medium',
                        getMembershipClass(user?.membershipName),
                      )}
                    >
                      {user?.membershipName || 'Miễn phí'}
                    </span>
                    <span className="text-muted-foreground">
                      Lượt hỏi AI: {user?.numberOfQueryQuota ?? 0}
                    </span>
                  </div>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user?.role === ROLES.CANDIDATE && (
                <>
                  <DropdownMenuItem
                    onClick={() => navigate(ROUTES.CANDIDATE_UPGRADE)}
                    className="cursor-pointer"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Nâng cấp tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem
                onClick={() => setLogoutDialogOpen(true)}
                className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
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

      <ConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Đăng xuất tài khoản?"
        description="Bạn có chắc chắn muốn đăng xuất khỏi phiên làm việc hiện tại không?"
        confirmText="Đăng xuất"
        cancelText="Ở lại"
        onConfirm={handleLogout}
        destructive
      />
      <LogoutLoadingOverlay show={loggingOut} />
    </div>
  );
}
