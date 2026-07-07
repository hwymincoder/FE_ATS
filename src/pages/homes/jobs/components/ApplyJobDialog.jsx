import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';

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

export function ApplyJobDialog({ open, onOpenChange, job }) {
  const cvFileInputRef = useRef(null);
  const form = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: applyDefaultValues,
    mode: 'onTouched',
  });

  const { mutate, isPending } = useApplyJob({
    onSuccess: () => {
      onOpenChange(false);
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset(applyDefaultValues);
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