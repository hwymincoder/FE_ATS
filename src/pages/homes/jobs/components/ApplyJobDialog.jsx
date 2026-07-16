import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { useApplyJob } from '../hooks';
import { applyDefaultValues, applySchema } from '../schemas/apply.schema';

import { ApplyJobForm } from './ApplyJobForm';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/configs/routes';
import { ROLES } from '@/constants';

const PENDING_APPLY_KEY = 'pendingApply';

export function ApplyJobDialog({ open, onOpenChange, job }) {
  const cvFileInputRef = useRef(null);
  const form = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: applyDefaultValues,
    mode: 'onTouched',
  });

  const { user, accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { mutate, isPending } = useApplyJob({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  // Auth check — redirect to login if not authenticated or not CANDIDATE
  useEffect(() => {
    if (!open) return;

    const isAuthenticated = Boolean(accessToken);
    const isCandidate = user?.role === ROLES.CANDIDATE;

    if (!isAuthenticated || !isCandidate) {
      const formValues = form.getValues();
      const applyCtx = {
        jobId: job?.id,
        jobTitle: job?.title,
        formData: {
          fullName: formValues.fullName || '',
          email: formValues.email || '',
          phone: formValues.phone || '',
          message: formValues.message || '',
        },
      };

      sessionStorage.setItem(PENDING_APPLY_KEY, JSON.stringify(applyCtx));

      if (!isAuthenticated) {
        navigate(ROUTES.CANDIDATE_LOGIN, {
          state: {
            applyContext: applyCtx,
            from: location.pathname + location.search,
          },
        });
      } else {
        toast.error('Bạn cần đăng nhập tài khoản Ứng viên để ứng tuyển.');
        onOpenChange(false);
      }
    }
  }, [open, accessToken, user, form, job, navigate, location, onOpenChange]);

  // Pre-fill form when returning from login
  useEffect(() => {
    if (!open) return;

    const stored = sessionStorage.getItem(PENDING_APPLY_KEY);
    if (stored) {
      try {
        const ctx = JSON.parse(stored);
        if (ctx?.formData) {
          form.setValue('fullName', ctx.formData.fullName || '', { shouldValidate: false });
          form.setValue('email', ctx.formData.email || '', { shouldValidate: false });
          form.setValue('phone', ctx.formData.phone || '', { shouldValidate: false });
          form.setValue('message', ctx.formData.message || '', { shouldValidate: false });
        }
        // Clear replaceState to avoid pre-filling again on refresh
        window.history.replaceState({}, '', location.pathname + location.search);
      } catch {
        // ignore parse errors
      }
    }
  }, [open, form, location.pathname, location.search]);

  // Reset form and clear sessionStorage when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset(applyDefaultValues);
      sessionStorage.removeItem(PENDING_APPLY_KEY);
      if (cvFileInputRef.current) {
        cvFileInputRef.current.value = '';
      }
    }
  }, [open, form]);

  const handleSubmit = form.handleSubmit((values) => {
    const { cvFile, ...rest } = values;
    mutate({
      jobId: job?.id,
      payload: {
        fullName: rest.fullName?.trim(),
        email: rest.email?.trim(),
        phone: rest.phone?.trim() || null,
        message: rest.message?.trim() || null,
      },
      file: cvFile,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ứng tuyển vị trí</DialogTitle>
          <DialogDescription>
            {job?.title ? (
              <>
                Bạn đang ứng tuyển cho vị trí <span className="font-medium text-foreground">{job.title}</span>.
                Vui lòng điền thông tin và đính kèm CV của bạn.
              </>
            ) : (
              'Vui lòng điền thông tin và đính kèm CV của bạn.'
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <ApplyJobForm form={form} cvFileInputRef={cvFileInputRef} />

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Huỷ
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
