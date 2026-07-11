import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BriefcaseBusiness, Eye, EyeOff, Lock, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/auth-service';
import { useAuth } from '@/hooks/use-auth';
import { loginSchema } from '@/schemas/login-schema';
import { ROUTES } from '@/configs/routes';
import { APP_NAME } from '@/constants';
import { extractErrorMessage } from '@/lib/extract-error';
import { useChatbotStore } from '@/stores/chatbot-store';

export default function CandidateLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const chatContext = location.state?.chatContext;
  const from = location.state?.from || ROUTES.HOME;

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
    const result = loginSchema.safeParse(values);

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
      const data = await authService.candidateLogin(result.data);

      if (!data?.accessToken || !data?.user) {
        throw new Error('Invalid login response');
      }

      setAuth({
        user: data.user,
        accessToken: data.accessToken,
      });

      if (chatContext) {
        useChatbotStore.getState().openChat(chatContext);
      }

      toast.success(data.message || 'Login successful');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(extractErrorMessage(error, 'Login failed'));
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
          <CardTitle className="text-2xl">{APP_NAME} Candidate</CardTitle>
          <CardDescription>Login to continue your application journey</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-4" autoComplete="off">
          <div className="space-y-2">
            <Label htmlFor="candidate-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="candidate-email"
                type="email"
                placeholder="Enter email"
                className="pl-10"
                value={values.email}
                onChange={setField('email')}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="candidate-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="candidate-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                className="px-10"
                value={values.password}
                onChange={setField('password')}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login as candidate'}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <Link to={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
              Staff login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
