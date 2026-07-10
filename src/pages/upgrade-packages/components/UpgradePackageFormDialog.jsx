import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { z } from 'zod';

import { Loading } from '@/components/shared/loading';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpgradePackageDetail } from '@/pages/upgrade-packages/hooks/useUpgradePackageQueries';

const upgradePackageSchema = z.object({
  packageName: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập tên gói')
    .max(255, 'Tên gói không được vượt quá 255 ký tự'),
  description: z.string().trim().max(1000, 'Mô tả không được vượt quá 1000 ký tự').optional(),
  price: z.coerce
    .number({ invalid_type_error: 'Vui lòng nhập giá' })
    .positive('Giá phải lớn hơn 0')
    .max(9999999999999.99, 'Giá không hợp lệ'),
  numberOfQueryQuota: z.coerce
    .number({ invalid_type_error: 'Vui lòng nhập quota truy vấn' })
    .int('Quota truy vấn phải là số nguyên')
    .min(1, 'Quota truy vấn phải lớn hơn 0'),
  priority: z.coerce
    .number({ invalid_type_error: 'Vui lòng nhập độ ưu tiên' })
    .int('Độ ưu tiên phải là số nguyên')
    .min(0, 'Độ ưu tiên không được âm'),
});

const defaultValues = {
  packageName: '',
  description: '',
  price: '',
  numberOfQueryQuota: '',
  priority: 0,
};

export function UpgradePackageFormDialog({
  open,
  onOpenChange,
  initialData = null,
  isViewOnly = false,
  onSubmit,
  submitting = false,
}) {
  const isEdit = Boolean(initialData) && !isViewOnly;
  const { data: detail, isLoading } = useUpgradePackageDetail(initialData?.id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(upgradePackageSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;

    const source = detail ?? initialData;
    if (source) {
      reset({
        packageName: source.packageName || '',
        description: source.description || '',
        price: source.price ?? '',
        numberOfQueryQuota: source.numberOfQueryQuota ?? '',
        priority: source.priority ?? 0,
      });
    } else {
      reset(defaultValues);
    }
  }, [open, detail, initialData, reset]);

  const submitForm = (values) => {
    onSubmit({
      packageName: values.packageName.trim(),
      description: values.description || null,
      price: values.price,
      numberOfQueryQuota: values.numberOfQueryQuota,
      priority: values.priority,
    });
  };

  const closeDialog = () => {
    onOpenChange(false);
    reset(defaultValues);
  };

  const title = isViewOnly
    ? 'Chi tiết gói nâng cấp'
    : isEdit
      ? 'Cập nhật gói nâng cấp'
      : 'Thêm gói nâng cấp';

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeDialog();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Quản lý thông tin gói VIP và quota truy vấn trong hệ thống.</DialogDescription>
        </DialogHeader>

        {isLoading && initialData?.id ? (
          <Loading />
        ) : (
          <form
            id="upgrade-package-form"
            onSubmit={isViewOnly ? (e) => e.preventDefault() : handleSubmit(submitForm)}
          >
            <fieldset disabled={isViewOnly} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="packageName">
                  Tên gói <span className="text-destructive">*</span>
                </Label>
                <Input id="packageName" placeholder="VD: VIP Pro" {...register('packageName')} />
                {errors.packageName && (
                  <p className="text-sm text-destructive">{errors.packageName.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Giá <span className="text-destructive">*</span>
                  </Label>
                  <Input id="price" type="number" min="0" step="1000" {...register('price')} />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfQueryQuota">
                    Quota truy vấn <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="numberOfQueryQuota"
                    type="number"
                    min="1"
                    step="1"
                    {...register('numberOfQueryQuota')}
                  />
                  {errors.numberOfQueryQuota && (
                    <p className="text-sm text-destructive">
                      {errors.numberOfQueryQuota.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">
                    Ưu tiên <span className="text-destructive">*</span>
                  </Label>
                  <Input id="priority" type="number" min="0" step="1" {...register('priority')} />
                  {errors.priority && (
                    <p className="text-sm text-destructive">{errors.priority.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Mô tả quyền lợi hoặc giới hạn của gói"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
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
