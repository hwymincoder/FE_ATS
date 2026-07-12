import { useEffect, useState } from 'react';
import { ArrowRight, Check, Crown, LockKeyhole, PackageOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/configs/routes';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import { getCandidateUpgradePackages } from '@/pages/candidate/payments/services/vnpay-service';

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

function getPackageTheme(packageName) {
  if (packageName?.trim().toUpperCase() === 'PREMIUM') {
    return {
      card: 'border-violet-200 shadow-violet-100/70 hover:border-violet-300',
      header: 'bg-gradient-to-br from-slate-100 via-violet-50 to-violet-100',
      icon: 'bg-gradient-to-br from-violet-600 to-indigo-700 shadow-violet-200',
      price: 'text-violet-700',
      button: 'bg-gradient-to-r from-violet-600 to-indigo-700 hover:from-violet-700 hover:to-indigo-800',
      headerStyle: { background: 'linear-gradient(135deg, #f1f5f9 0%, #ede9fe 55%, #ddd6fe 100%)' },
      iconStyle: { background: 'linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)' },
    };
  }

  return {
    card: 'border-sky-200 shadow-sky-100/70 hover:border-sky-300',
    header: 'bg-gradient-to-br from-blue-50 via-white to-sky-100',
    icon: 'bg-gradient-to-br from-blue-600 to-sky-500 shadow-sky-200',
    price: 'text-blue-700',
    button: 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600',
    headerStyle: { background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 45%, #e0f2fe 100%)' },
    iconStyle: { background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)' },
  };
}

export default function CandidateUpgradePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getCandidateUpgradePackages()
      .then((response) => !cancelled && setPackages(response?.items ?? []))
      .catch(() => {
        if (!cancelled) {
          setError(true);
          toast.error('Không thể tải danh sách gói nâng cấp');
        }
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const hasPaidMembership = Boolean(
    user?.membershipName && user.membershipName.trim().toUpperCase() !== 'FREE',
  );
  const membershipIsActive = hasPaidMembership && (
    !user?.membershipExpiresAt
    || new Date(user.membershipExpiresAt).getTime() > Date.now()
  );

  const isLocked = (item) =>
    membershipIsActive && Number(item.priority ?? 0) <= Number(user?.membershipPriority ?? 0);

  const choose = (item) => {
    navigate(ROUTES.CANDIDATE_CHECKOUT.replace(':packageId', item.id), {
      state: { upgradePackage: item },
    });
  };

  return (
    <div
      className="min-h-[calc(100vh-5rem)]"
      style={{ background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 58%, #f8fafc 100%)' }}
    >
      <section
        className="relative overflow-hidden border-b text-white"
        style={{ background: 'linear-gradient(110deg, #0b2e6f 0%, #0754b8 52%, #0284c7 100%)' }}
      >
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-6 px-6 py-6 lg:grid-cols-[1fr_320px] lg:items-center lg:px-10">
          <div className="max-w-2xl">
            <Badge className="mb-4 border-white/20 bg-white/10 text-white hover:bg-white/10">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Đặc quyền dành cho ứng viên
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Nâng tầm hồ sơ của bạn</h1>
            <p className="mt-2 max-w-xl text-sm leading-5 text-blue-100">
              Mở rộng lượt hỏi AI và tăng độ ưu tiên hồ sơ để tiếp cận cơ hội phù hợp nhanh hơn.
            </p>
          </div>

          <div
            className="rounded-2xl border border-white/30 p-4 text-white shadow-xl backdrop-blur-md"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.14)' }}
          >
            <div className="text-xs uppercase tracking-wider text-blue-100">Gói hiện tại</div>
            <div className="mt-1 flex items-center gap-2 text-xl font-semibold">
              <Crown className="h-5 w-5 text-amber-300" />
              {user?.membershipName || 'Miễn phí'}
            </div>
            <div className="mt-2 text-sm text-blue-100">
              {membershipIsActive && user?.membershipExpiresAt
                ? `Có hiệu lực đến ${dateFormatter.format(new Date(user.membershipExpiresAt))}`
                : membershipIsActive
                  ? 'Đang hoạt động · Chưa có thông tin ngày hết hạn'
                  : 'Chưa có gói trả phí đang hoạt động'}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl px-6 py-6 lg:px-10">
        <div className="mb-5 text-center">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Chọn gói phù hợp với bạn</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Thanh toán an toàn qua VNPay · Kích hoạt quyền lợi ngay sau khi xác nhận
          </p>
        </div>

        {loading && (
          <div className="flex justify-center rounded-2xl border bg-background p-20 shadow-sm">
            <div className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {!loading && (error || !packages.length) && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border bg-background p-20 text-muted-foreground shadow-sm">
            <PackageOpen className="h-12 w-12" />
            <p>{error ? 'Không thể tải các gói nâng cấp' : 'Chưa có gói nâng cấp nào'}</p>
          </div>
        )}

        {!loading && packages.length > 0 && (
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
            {packages.map((item) => {
              const theme = getPackageTheme(item.packageName);
              const locked = isLocked(item);
              const isPremium = item.packageName?.trim().toUpperCase() === 'PREMIUM';
              const isCurrentPackage =
                membershipIsActive
                && item.packageName?.trim().toUpperCase()
                  === user?.membershipName?.trim().toUpperCase();

              return (
                <Card
                  key={item.id}
                  className={cn(
                    'group relative flex min-h-[330px] flex-col overflow-hidden rounded-3xl border-2 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(15,23,42,0.16)]',
                    theme.card,
                  )}
                >
                  {isPremium && (
                    <div className="absolute right-5 top-5 z-10 rounded-full bg-violet-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-md ring-2 ring-white/80">
                      Phổ biến
                    </div>
                  )}

                  <CardHeader className={cn('space-y-3 p-5', theme.header)} style={theme.headerStyle}>
                    <div className="flex items-center gap-4">
                      <div
                        className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-lg', theme.icon)}
                        style={theme.iconStyle}
                      >
                        {isPremium ? <Crown className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                      </div>
                      <div>
                        <CardTitle className="text-xl tracking-wide">{item.packageName}</CardTitle>
                        <div className="mt-1 text-xs font-medium uppercase tracking-wider text-slate-500">
                          Gói thành viên 30 ngày
                        </div>
                      </div>
                    </div>
                    <div>
                        <div className={cn('text-3xl font-extrabold tracking-tight', theme.price)}>
                        {money.format(Number(item.price || 0))}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3 border-t border-slate-100 bg-white p-5">
                    <p className="min-h-10 text-sm leading-5 text-slate-600">
                      {item.description || 'Gói nâng cấp dành cho tài khoản Candidate'}
                    </p>
                    <div className="grid gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 sm:grid-cols-1">
                      <div className="flex items-center gap-3 text-sm text-slate-800">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="h-4 w-4" />
                        </span>
                        <span><strong>{Number(item.numberOfQueryQuota || 0).toLocaleString('vi-VN')}</strong> lượt hỏi AI</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-800">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                          <Check className="h-4 w-4" />
                        </span>
                        <span>Độ ưu tiên hồ sơ mức <strong>{item.priority ?? 0}</strong></span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-white p-5 pt-0">
                    <Button
                      className={cn(
                        'h-11 w-full rounded-xl font-semibold shadow-sm',
                        locked
                          ? 'border border-slate-300 bg-slate-200 text-slate-700 opacity-100 disabled:text-slate-700 disabled:opacity-100'
                          : cn('text-white', theme.button),
                      )}
                      variant={locked ? 'secondary' : 'default'}
                      disabled={locked}
                      onClick={() => choose(item)}
                    >
                      {locked ? (
                        <>
                          {isCurrentPackage ? <Crown className="mr-2 h-4 w-4" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
                          {isCurrentPackage ? 'Gói đang sử dụng' : 'Bạn đang sở hữu gói cao hơn'}
                        </>
                      ) : (
                        <>Chọn {item.packageName}<ArrowRight className="ml-2 h-4 w-4" /></>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
