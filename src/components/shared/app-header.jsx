import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, KeyRound, LogIn, LogOut, Menu, Sparkles, User, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';

function scrollToId(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getRoleLabel(role) {
  const labels = {
    [ROLES.ADMIN]: 'Quản trị viên',
    [ROLES.RECRUITER]: 'Nhân viên tuyển dụng',
    [ROLES.INTERVIEWER]: 'Người phỏng vấn',
    [ROLES.CANDIDATE]: 'Ứng viên',
  };

  return labels[role] || role || 'Tài khoản';
}

function getMembershipName(user) {
  if (user?.role !== ROLES.CANDIDATE) {
    return getRoleLabel(user?.role);
  }

  return user?.membershipName || 'Miễn phí';
}

function getMembershipBadgeClass(membershipName) {
  const normalizedName = membershipName?.trim().toUpperCase();

  if (normalizedName === 'PRO') {
    return 'border-slate-300 bg-gradient-to-r from-slate-100 via-white to-slate-200 text-slate-700 shadow-sm';
  }

  if (normalizedName === 'PREMIUM') {
    return 'border-violet-300 bg-gradient-to-r from-slate-200 via-violet-100 to-slate-300 text-violet-900 shadow-sm ring-1 ring-violet-200/70';
  }

  return '';
}

function AccountInfoRow({ label, value }) {
  if (value === undefined || value === null || value === '') return null;

  return (
    <div className="flex items-center justify-between gap-4 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[150px] truncate font-medium text-foreground">{value}</span>
    </div>
  );
}

export default function AppHeader({ navItems = NAV_ITEMS }) {
  const { user, clearAuth } = useAuth();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLogoutDialogOpen(false);
    setLoggingOut(true);
    window.setTimeout(() => {
      setLoggingOut(false);
      clearAuth();
      navigate(ROUTES.HOME, { replace: true });
    }, 1500);
  };

  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };

  const renderNavItem = (item, { isMobile = false, onNavigate } = {}) => {
    const isAnchor = typeof item.href === 'string' && item.href.startsWith('#');

    if (isAnchor) {
      const handleClick = (e) => {
        e.preventDefault();
        scrollToId(item.href);
        onNavigate?.();
      };
      return (
        <a
          key={item.key}
          href={item.href}
          onClick={handleClick}
          className={cn(
            isMobile
              ? 'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent'
              : cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors',
                  'after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-gradient-to-r after:from-bv-secondary after:to-bv-accent after:transition-all',
                  'text-muted-foreground hover:text-bv-primary',
                ),
          )}
        >
          {item.label}
        </a>
      );
    }

    return (
      <NavLink
        key={item.key}
        to={item.path}
        end={item.path === '/'}
        onClick={() => onNavigate?.()}
        className={({ isActive }) =>
          isMobile
            ? cn(
                'rounded-md px-3 py-2 text-sm font-medium',
                isActive ? 'bg-bv-primary text-white' : 'text-muted-foreground hover:bg-accent',
              )
            : cn(
                'relative px-4 py-2 text-sm font-medium transition-colors',
                'after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:rounded-full after:bg-gradient-to-r after:from-bv-secondary after:to-bv-accent after:transition-all',
                'hover:text-bv-primary',
                isActive ? 'text-bv-primary after:w-8' : 'text-muted-foreground',
              )
        }
      >
        {item.label}
      </NavLink>
    );
  };

  const hasAnchors = navItems.some(
    (item) => typeof item.href === 'string' && item.href.startsWith('#'),
  );

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <div className="flex h-16 items-stretch">
        {/* Logo zone - gradient BVBank with slanted right edge */}
        <button
          type="button"
          onClick={() => navigate(ROUTES.HOME)}
          aria-label="Về trang chủ"
          className="relative flex cursor-pointer items-center gap-3 border-0 px-5 text-left text-white transition-[filter] hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
          style={{
            background:
              'linear-gradient(135deg, hsl(var(--bv-primary-deep)) 0%, hsl(var(--bv-primary)) 50%, hsl(var(--bv-secondary)) 100%)',
            clipPath: 'polygon(0 0, 100% 0, calc(100% - 28px) 100%, 0 100%)',
            minWidth: '260px',
          }}
        >
          {/* Logo 3 tam giác BVBank */}
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15 backdrop-blur-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3 L21 20 L3 20 Z" fill="white" stroke="white" />
              <path d="M12 9 L17 20 L7 20 Z" fill="hsl(var(--bv-secondary))" stroke="white" />
              <path d="M12 14 L14 20 L10 20 Z" fill="white" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-wide">{APP_NAME}</span>
            <span className="text-[10px] uppercase tracking-widest text-white/70">
              ATS
            </span>
          </div>
        </button>

        {/* Right zone - white background */}
        <div className="flex flex-1 items-center justify-between bg-background pl-6 pr-4">
          {/* Left side: collapse sidebar + nav (desktop) */}
          <div className="flex items-center gap-2">
            {!hasAnchors && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Toggle sidebar">
                <Menu className="h-5 w-5" />
              </Button>
            )}

            <nav className="ml-4 hidden items-center gap-1 md:flex">
              {navItems.map((item) => renderNavItem(item))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-1">
            {user ? (
              <>
                <Button variant="ghost" size="icon" aria-label="Thông báo" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-bv-secondary" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-bv-primary text-white">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="hidden text-sm font-medium sm:inline">
                        {user.fullName || user.username || 'User'}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 p-0">
                    <DropdownMenuLabel className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bv-primary text-white">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">
                            {user.fullName || user.username || 'Tài khoản'}
                          </div>
                          <div className="truncate text-xs font-normal text-muted-foreground">
                            {user.username || 'Chưa có email'}
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={cn('gap-1', getMembershipBadgeClass(user.membershipName))}
                            >
                              <Sparkles className="h-3 w-3" />
                              {getMembershipName(user)}
                            </Badge>
                            <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <div className="space-y-2 border-t px-4 py-3">
                      <AccountInfoRow label="Email" value={user.username} />
                      <AccountInfoRow
                        label="Lượt hỏi AI"
                        value={
                          user.numberOfQueryQuota !== undefined && user.numberOfQueryQuota !== null
                            ? `${user.numberOfQueryQuota} lượt`
                            : null
                        }
                      />
                    </div>
                    <DropdownMenuSeparator />
                    {user.role === ROLES.CANDIDATE && (
                      <>
                        <DropdownMenuItem
                          onSelect={() => navigate(ROUTES.CANDIDATE_CHANGE_PASSWORD)}
                          className="cursor-pointer px-4 py-3"
                        >
                          <KeyRound className="mr-2 h-4 w-4" />
                          Đổi mật khẩu
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => navigate(ROUTES.CANDIDATE_UPGRADE)}
                          className="cursor-pointer px-4 py-3 text-bv-primary focus:bg-bv-primary/10 focus:text-bv-primary"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Nâng cấp tài khoản
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      onClick={openLogoutDialog}
                      className="cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button
                className="gap-2"
                onClick={() => navigate(ROUTES.CANDIDATE_LOGIN)}
              >
                <LogIn className="h-4 w-4" />
                Đăng nhập
              </Button>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Wave SVG dưới header */}
      <svg
        className="-mt-px block h-3 w-full"
        viewBox="0 0 1200 24"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 L260,0 L288,12 L0,24 Z" fill="hsl(var(--bv-primary))" />
        <path
          d="M260,0 L1200,0 L1200,8 C900,18 600,4 288,12 L260,0 Z"
          fill="hsl(var(--bv-accent-soft))"
          opacity="0.6"
        />
        <path
          d="M260,0 L1200,0 L1200,4 C900,9 600,2 288,6 L260,0 Z"
          fill="hsl(var(--bv-accent))"
          opacity="0.35"
        />
      </svg>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <nav className="absolute left-0 right-0 top-full z-50 border-b bg-background shadow-md md:hidden">
          <div className="flex flex-col p-2">
            {navItems.map((item) =>
              renderNavItem(item, { isMobile: true, onNavigate: () => setMobileOpen(false) }),
            )}
          </div>
        </nav>
      )}

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
    </header>
  );
}
