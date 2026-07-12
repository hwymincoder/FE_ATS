import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/configs/routes';
import { useAuth } from '@/hooks/use-auth';
import { extractErrorMessage } from '@/lib/extract-error';
import { candidateChangePasswordSchema } from '@/schemas/candidate-change-password-schema';
import { candidateService } from '@/services/candidate-service';

function getCandidateId(user) {
  return user?.id ?? user?.candidateId ?? user?.userId;
}

function mergeCandidateUser(currentUser, candidate) {
  if (!candidate) return currentUser;

  return {
    ...currentUser,
    ...candidate,
    role: currentUser?.role,
    fullName: candidate.name ?? currentUser?.fullName,
    username: candidate.email ?? currentUser?.username,
  };
}

export default function CandidateChangePasswordPage() {
  const { user, setUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [values, setValues] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});

  const candidateId = getCandidateId(user);

  const setField = (field) => (event) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: event.target.value,
    }));

    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    if (!candidateId) {
      toast.error('Không tìm thấy thông tin ứng viên');
      return;
    }

    const result = candidateChangePasswordSchema.safeParse(values);

    if (!result.success) {
      const fieldErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0]] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const data = await candidateService.updatePassword(candidateId, {
        oldPassword: result.data.oldPassword,
        newPassword: result.data.newPassword,
      });

      setUser(mergeCandidateUser(user, data));
      setValues({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Đổi mật khẩu thành công');
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Đổi mật khẩu thất bại'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-muted/30 px-4 py-8">
      <div className="mx-auto w-full max-w-md">
        <Button asChild variant="ghost" className="mb-4 gap-2 px-0">
          <Link to={ROUTES.HOME}>
            <ArrowLeft className="h-4 w-4" />
            Trang chủ
          </Link>
        </Button>

        <Card className="overflow-hidden border-primary/20 shadow-lg">
          <CardHeader className="space-y-3 bg-primary/5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <KeyRound className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl">Đổi mật khẩu</CardTitle>
              <CardDescription>Cập nhật mật khẩu tài khoản ứng viên</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
              <div className="space-y-2">
                <Label htmlFor="old-password">Mật khẩu hiện tại</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="old-password"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="px-10"
                    value={values.oldPassword}
                    onChange={setField('oldPassword')}
                    autoComplete="current-password"
                  />
                </div>
                {errors.oldPassword && (
                  <p className="text-sm text-destructive">{errors.oldPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="new-password"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Nhập mật khẩu mới"
                    className="px-10"
                    value={values.newPassword}
                    onChange={setField('newPassword')}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((visible) => !visible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showPasswords ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPasswords ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-destructive">{errors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Nhập lại mật khẩu mới"
                    className="pl-10"
                    value={values.confirmPassword}
                    onChange={setField('confirmPassword')}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={submitting || !candidateId}>
                {submitting ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
