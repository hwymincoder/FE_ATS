import { FileText, Upload, X } from 'lucide-react';

import { ACCEPTED_FILE_TYPES } from '../constants/apply.constants';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

export function ApplyJobForm({ form, cvFileInputRef }) {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form;
  const cvFile = watch('cvFile');

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setValue('cvFile', file, { shouldValidate: true });
  };

  const clearCvFile = () => {
    setValue('cvFile', null, { shouldValidate: true });
    if (cvFileInputRef?.current) {
      cvFileInputRef.current.value = '';
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="fullName">
          Họ và tên <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fullName"
          autoComplete="name"
          placeholder="Nguyễn Văn A"
          aria-invalid={!!errors.fullName}
          {...register('fullName')}
        />
        <FieldError message={errors.fullName?.message} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="0901234567"
            aria-invalid={!!errors.phone}
            {...register('phone')}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Lời nhắn</Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Chia sẻ ngắn gọn về bản thân hoặc lý do bạn quan tâm đến vị trí này..."
          aria-invalid={!!errors.message}
          {...register('message')}
        />
        <FieldError message={errors.message?.message} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="cvFile">
          CV đính kèm <span className="text-destructive">*</span>
        </Label>
        <input
          ref={cvFileInputRef}
          id="cvFile"
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          onChange={handleFileChange}
          aria-invalid={!!errors.cvFile}
          className="hidden"
        />
        {cvFile ? (
          <div className="flex items-center justify-between gap-3 rounded-md border border-dashed border-input bg-muted/40 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-bv-primary" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{cvFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(cvFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearCvFile}
              className="gap-1 text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4" />
              Chọn lại
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => cvFileInputRef?.current?.click()}
            className="gap-2 border-dashed"
          >
            <Upload className="h-4 w-4" />
            Chọn file CV (PDF, DOC, DOCX - tối đa 10MB)
          </Button>
        )}
        <FieldError message={errors.cvFile?.message} />
      </div>
    </div>
  );
}