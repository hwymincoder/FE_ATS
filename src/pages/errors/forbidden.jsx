import { ShieldX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/configs/routes';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <ShieldX className="mb-4 h-16 w-16 text-destructive" />
      <h1 className="text-3xl font-bold">403 - Không có quyền truy cập</h1>
      <p className="mt-2 text-muted-foreground">
        Tài khoản của bạn không được phép truy cập trang này.
      </p>
      <Button className="mt-6" onClick={() => navigate(ROUTES.DASHBOARD, { replace: true })}>
        Về Dashboard
      </Button>
    </div>
  );
}
