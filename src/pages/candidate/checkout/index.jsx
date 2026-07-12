import { useEffect, useState } from 'react';
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ROUTES } from '@/configs/routes';
import { createVnPayPayment, getCandidateUpgradePackages } from '@/pages/candidate/payments/services/vnpay-service';

const BANKS = [{ value: 'VNPAY', label: 'Chọn ngân hàng tại VNPay' }, { value: 'NCB', label: 'NCB' }, { value: 'VNBANK', label: 'Thẻ ATM/Tài khoản ngân hàng' }, { value: 'INTCARD', label: 'Thẻ thanh toán quốc tế' }];
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });

export default function CandidateCheckoutPage() {
  const { packageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(location.state?.upgradePackage ?? null);
  const [bankCode, setBankCode] = useState('VNPAY');
  const [loading, setLoading] = useState(!pkg);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (pkg) return;
    let cancelled = false;
    getCandidateUpgradePackages({ size: 100 }).then((res) => { const found = (res?.items ?? []).find((item) => String(item.id) === String(packageId)); if (!cancelled) setPkg(found ?? null); }).catch(() => !cancelled && toast.error('Không thể tải thông tin gói')).finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [packageId, pkg]);
  const pay = async () => {
    if (!pkg || submitting) return;
    const membershipIsActive = user?.membershipExpiresAt
      ? new Date(user.membershipExpiresAt).getTime() > Date.now()
      : false;
    if (
      membershipIsActive
      && Number(pkg.priority ?? 0) <= Number(user?.membershipPriority ?? 0)
    ) {
      toast.error('Gói hiện tại còn hiệu lực. Bạn chỉ có thể mua gói cao hơn.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await createVnPayPayment({ upgradePackageId: pkg.id, bankCode: bankCode === 'VNPAY' ? null : bankCode });
      const payment = result?.data;
      if (!payment?.transactionId || !payment?.paymentUrl) throw new Error('Invalid response');
      sessionStorage.setItem('vnpayTransactionId', payment.transactionId);
      window.location.assign(payment.paymentUrl);
    } catch { toast.error('Không thể khởi tạo thanh toán VNPay'); setSubmitting(false); }
  };
  if (loading) return <div className="p-16 text-center text-muted-foreground">Đang tải thông tin gói...</div>;
  if (!pkg) return <div className="space-y-4 rounded-xl border bg-background p-10 text-center"><p>Không tìm thấy gói nâng cấp</p><Button onClick={() => navigate(ROUTES.CANDIDATE_UPGRADE)}>Quay lại danh sách gói</Button></div>;
  return <div className="mx-auto max-w-3xl space-y-6 px-6 py-10"><PageHeader title="Xác nhận thanh toán" description="Kiểm tra gói trước khi chuyển sang VNPay" /><Card><CardHeader><CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" />{pkg.packageName}</CardTitle></CardHeader><CardContent className="space-y-6">
    <div className="grid gap-4 rounded-lg bg-muted/50 p-4 sm:grid-cols-2"><div><div className="text-sm text-muted-foreground">Tổng thanh toán</div><div className="text-2xl font-bold text-primary">{money.format(Number(pkg.price || 0))}</div></div><div><div className="text-sm text-muted-foreground">Quyền lợi</div><div className="font-medium">{Number(pkg.numberOfQueryQuota || 0).toLocaleString('vi-VN')} lượt hỏi AI</div><div className="text-sm text-muted-foreground">Ưu tiên hồ sơ mức {pkg.priority ?? 0}</div></div></div>
    <div className="space-y-2"><Label>Phương thức thanh toán</Label><Select value={bankCode} onValueChange={setBankCode}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{BANKS.map((bank) => <SelectItem key={bank.value} value={bank.value}>{bank.label}</SelectItem>)}</SelectContent></Select></div>
    <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />Bạn sẽ được chuyển sang cổng VNPay chính thức để hoàn tất thanh toán an toàn.</div>
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Button variant="outline" onClick={() => navigate(ROUTES.CANDIDATE_UPGRADE)}><ArrowLeft className="mr-2 h-4 w-4" />Chọn gói khác</Button><Button onClick={pay} disabled={submitting}>{submitting ? 'Đang chuyển sang VNPay...' : 'Thanh toán qua VNPay'}</Button></div>
  </CardContent></Card></div>;
}
