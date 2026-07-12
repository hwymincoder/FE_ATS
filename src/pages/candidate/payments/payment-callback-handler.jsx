import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ROLES } from '@/constants';
import { useAuth } from '@/hooks/use-auth';
import { getCurrentCandidate, getVnPayPayment } from './services/vnpay-service';

export default function PaymentCallbackHandler() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isAuthenticated, setUser } = useAuth();
  const transactionId =
    searchParams.get('transactionId') || sessionStorage.getItem('vnpayTransactionId');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== ROLES.CANDIDATE) return;

    let cancelled = false;
    getCurrentCandidate()
      .then((candidate) => {
        if (!cancelled) setUser(candidate);
      })
      .catch(() => {
        // Keep the persisted profile when a background refresh is temporarily unavailable.
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, setUser, user?.role]);

  useEffect(() => {
    if (!transactionId || !isAuthenticated || user?.role !== ROLES.CANDIDATE) return;
    let cancelled = false;
    const checkPayment = async () => {
      try {
        const result = await getVnPayPayment(transactionId);
        if (cancelled) return;
        if (result?.data?.status === 'SUCCESS') {
          const candidate = await getCurrentCandidate();
          if (cancelled) return;
          setUser(candidate);
          toast.success('Nâng cấp tài khoản thành công');
        } else if (result?.data?.status === 'FAILED') {
          toast.error('Thanh toán không thành công');
        } else {
          toast.info('Giao dịch đang được xác nhận');
        }
      } catch {
        if (!cancelled) toast.error('Không thể kiểm tra kết quả thanh toán');
      } finally {
        if (!cancelled) {
          const next = new URLSearchParams(searchParams);
          next.delete('transactionId');
          setSearchParams(next, { replace: true });
          sessionStorage.removeItem('vnpayTransactionId');
        }
      }
    };
    checkPayment();
    return () => { cancelled = true; };
  }, [isAuthenticated, searchParams, setSearchParams, setUser, transactionId, user?.role]);
  return null;
}
