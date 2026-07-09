import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { z } from 'zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/shared/loading';
import { usePipelineStageDetail } from '@/pages/pipeline-stages/hooks/usePipelineStageQueries';

const pipelineStageSchema = z.object({
  stageName: z.string().min(1, 'Vui lòng nhập tên giai đoạn').max(100, 'Tên giai đoạn tối đa 100 ký tự'),
  stageOrder: z.coerce.number().int('Thứ tự phải là số nguyên').min(1, 'Thứ tự phải lớn hơn 0'),
});

export function PipelineStageFormDialog({
  open,
  onOpenChange,
  initialData = null,
  isViewOnly = false,
  onSubmit,
  submitting = false,
}) {
  const isEdit = Boolean(initialData) && !isViewOnly;
  const { data: detail, isLoading } = usePipelineStageDetail(initialData?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pipelineStageSchema),
    defaultValues: {
      stageName: '',
      stageOrder: '',
    },
  });

  useEffect(() => {
    if (!open) return;

    const source = detail ?? initialData;
    reset({
      stageName: source?.stageName ?? '',
      stageOrder: source?.stageOrder ?? '',
    });
  }, [detail, initialData, open, reset]);

  const closeDialog = () => {
    onOpenChange(false);
    reset({ stageName: '', stageOrder: '' });
  };

  const submitForm = (values) => {
    onSubmit({
      stageName: values.stageName.trim(),
      stageOrder: values.stageOrder,
    });
  };

  const title = isViewOnly
    ? 'Chi tiết giai đoạn tuyển dụng'
    : isEdit
      ? 'Cập nhật giai đoạn tuyển dụng'
      : 'Thêm giai đoạn tuyển dụng';

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeDialog();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Quản lý thông tin giai đoạn xử lý hồ sơ ứng viên.</DialogDescription>
        </DialogHeader>

        {isLoading && initialData?.id ? (
          <Loading />
        ) : (
          <form onSubmit={isViewOnly ? (event) => event.preventDefault() : handleSubmit(submitForm)}>
            <fieldset disabled={isViewOnly} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stageName">Tên giai đoạn *</Label>
                <Input id="stageName" maxLength={100} placeholder="Đã ứng tuyển" {...register('stageName')} />
                {errors.stageName && (
                  <p className="text-sm text-destructive">{errors.stageName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stageOrder">Thứ tự *</Label>
                <Input id="stageOrder" type="number" min="1" step="1" {...register('stageOrder')} />
                {errors.stageOrder && (
                  <p className="text-sm text-destructive">{errors.stageOrder.message}</p>
                )}
              </div>
            </fieldset>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={closeDialog} disabled={submitting}>
                {isViewOnly ? 'Đóng' : 'Hủy'}
              </Button>
              {!isViewOnly && (
                <Button type="submit" disabled={submitting}>
                  <Save className="mr-2 h-4 w-4" />
                  {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Lưu'}
                </Button>
              )}
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
