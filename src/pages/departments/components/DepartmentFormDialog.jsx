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
import { Textarea } from '@/components/ui/textarea';
import { Loading } from '@/components/shared/loading';
import {
  useCreateDepartment,
  useDepartmentById,
  useUpdateDepartment,
  useDepartmentSelection,
} from '@/pages/departments/hooks';

const departmentSchema = z.object({
  departmentName: z.string().min(1, 'Vui lòng nhập tên phòng ban'),
  description: z.string().optional().default(''),
  parentId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v == null ? null : Number(v))),
});


export function DepartmentFormDialog({
  open,
  onOpenChange,
  initialData = null,
  isEdit = false,
  isViewOnly = false,
  onSuccess,
}) {
  const { data: editingDetail, isLoading: isLoadingDetail } = useDepartmentById(
    isEdit && initialData?.id ? initialData.id : null,
  );
  const { data: departmentSelection = [] } = useDepartmentSelection();

  const createMutation = useCreateDepartment({
    onSuccess: () => {
      onSuccess?.();
      onOpenChange(false);
    },
  });
  const updateMutation = useUpdateDepartment(initialData?.id, {
    onSuccess: () => {
      onSuccess?.();
      onOpenChange(false);
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: { departmentName: '', description: '', parentId: '' },
  });

  useEffect(() => {
    if (!open) return;
    const source = isEdit ? editingDetail ?? initialData : null;
    if (source) {
      reset({
        departmentName: source.departmentName || '',
        description: source.description || '',
        parentId: source.parentId ?? '',
      });
    } else {
      reset({ departmentName: '', description: '', parentId: '' });
    }
  }, [open, isEdit, editingDetail, initialData, reset]);

  const onSubmit = (values) => {
    const payload = {
      departmentName: values.departmentName,
      description: values.description,
      parentId: values.parentId || null,
    };
    if (isEdit) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  };

  const submitting = createMutation.isPending || updateMutation.isPending;
  const showLoading = isEdit && isLoadingDetail && !editingDetail;

  const parentOptions = (departmentSelection || []).filter(
    (d) => !isEdit || String(d.id) !== String(initialData?.id),
  );

  const closeAndReset = () => {
    onOpenChange(false);
    reset({ departmentName: '', description: '', parentId: '' });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) closeAndReset();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isViewOnly
              ? 'Xem chi tiết phòng ban'
              : isEdit
                ? 'Cập nhật phòng ban'
                : 'Thêm mới phòng ban'}
          </DialogTitle>
          <DialogDescription>
            {isViewOnly
              ? 'Thông tin chi tiết của phòng ban'
              : isEdit
                ? 'Cập nhật thông tin phòng ban trong hệ thống'
                : 'Tạo mới phòng ban trong hệ thống'}
          </DialogDescription>
        </DialogHeader>

        {showLoading ? (
          <Loading />
        ) : (
          <form
            id="department-form"
            onSubmit={isViewOnly ? (e) => e.preventDefault() : handleSubmit(onSubmit)}
          >
            <fieldset disabled={isViewOnly} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="departmentName">
                  Tên phòng ban <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="departmentName"
                  placeholder="VD: Phòng IT"
                  {...register('departmentName')}
                />
                {errors.departmentName && (
                  <p className="text-sm text-destructive">{errors.departmentName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentId">Phòng ban cha</Label>
                <select
                  id="parentId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('parentId')}
                >
                  <option value="">— Không có —</option>
                  {parentOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.departmentName || `#${d.id}`}
                    </option>
                  ))}
                </select>
                {errors.parentId && (
                  <p className="text-sm text-destructive">{errors.parentId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Mô tả phòng ban"
                  {...register('description')}
                />
              </div>
            </fieldset>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={closeAndReset}
                disabled={submitting}
              >
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
