import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BriefcaseBusiness, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ROUTES } from '@/configs/routes';
import { APP_NAME } from '@/constants';
import { extractErrorMessage } from '@/lib/extract-error';
import { candidateRegisterSchema } from '@/schemas/candidate-register-schema';
import { candidateService } from '@/services/candidate-service';

export default function CandidateRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

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
    const result = candidateRegisterSchema.safeParse(values);

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
      const data = await candidateService.create(result.data);

      toast.success(`Đăng ký thành công${data?.name ? ` cho ${data.name}` : ''}`);
      navigate(ROUTES.CANDIDATE_LOGIN, {
        replace: true,
        state: { email: result.data.email },
      });
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Đăng ký tài khoản thất bại'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md overflow-hidden border-primary/20 shadow-lg">
      <CardHeader className="space-y-3 bg-primary/5 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <BriefcaseBusiness className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl">{APP_NAME}</CardTitle>
          <CardDescription>Đăng ký tài khoản ứng viên</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="candidate-name">Họ tên</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="candidate-name"
                type="text"
                placeholder="Nhập họ tên"
                className="pl-10"
                value={values.name}
                onChange={setField('name')}
                autoComplete="name"
              />
            </div>
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="candidate-email"
                type="email"
                placeholder="Nhập email"
                className="pl-10"
                value={values.email}
                onChange={setField('email')}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate-phone">Số điện thoại</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="candidate-phone"
                type="tel"
                placeholder="Nhập số điện thoại"
                className="pl-10"
                value={values.phone}
                onChange={setField('phone')}
                autoComplete="tel"
              />
            </div>
            {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate-password">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="candidate-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                className="px-10"
                value={values.password}
                onChange={setField('password')}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{' '}
            <Link to={ROUTES.CANDIDATE_LOGIN} className="font-medium text-primary hover:underline">
              Đăng nhập ứng viên
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
