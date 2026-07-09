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
import { useDepartmentSelection } from '@/pages/departments/hooks';
import { USER_ROLE_LABELS, USER_STATUS_LABELS } from '@/pages/users/constants';
import { useUserDetail } from '@/pages/users/hooks/useUserQueries';

const optionalDepartmentId = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) => (value === '' || value == null ? null : Number(value)));

const userSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ tên').max(255, 'Họ tên tối đa 255 ký tự'),
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không hợp lệ').max(255, 'Email tối đa 255 ký tự'),
  phone: z.string().min(1, 'Vui lòng nhập số điện thoại').max(30, 'Số điện thoại tối đa 30 ký tự'),
  password: z
    .string()
    .optional()
    .default('')
    .refine((value) => !value || value.length >= 6, 'Mật khẩu tối thiểu 6 ký tự'),
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
  status: z.string().min(1, 'Vui lòng chọn trạng thái'),
  departmentId: optionalDepartmentId,
});

function getDepartmentId(user) {
  if (user?.departmentId && typeof user.departmentId === 'object') return user.departmentId.id;
  return user?.departmentId ?? user?.department?.id ?? '';
}

export function UserFormDialog({
  open,
  onOpenChange,
  initialData = null,
  isViewOnly = false,
  roles = [],
  statuses = [],
  onSubmit,
  submitting = false,
}) {
  const isEdit = Boolean(initialData) && !isViewOnly;
  const { data: detail, isLoading: isLoadingDetail } = useUserDetail(initialData?.id);
  const { data: departments = [], isLoading: isLoadingDepartments } = useDepartmentSelection();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: '',
      status: '',
      departmentId: '',
    },
  });

  useEffect(() => {
    if (!open) return;

    const source = detail ?? initialData;
    reset({
      name: source?.name ?? source?.fullName ?? '',
      email: source?.email ?? '',
      phone: source?.phone ?? '',
      password: '',
      role: source?.role ?? roles[0] ?? '',
      status: source?.status ?? statuses[0] ?? '',
      departmentId: getDepartmentId(source),
    });
  }, [detail, initialData, open, reset, roles, statuses]);

  const closeDialog = () => {
    onOpenChange(false);
    reset({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: roles[0] ?? '',
      status: statuses[0] ?? '',
      departmentId: '',
    });
  };

  const submitForm = (values) => {
    if (!isEdit && !values.password?.trim()) {
      setError('password', { message: 'Vui lòng nhập mật khẩu' });
      return;
    }

    const payload = {
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() || null,
      role: values.role,
      status: values.status,
      departmentId: values.departmentId,
    };

    if (values.password?.trim()) {
      payload.password = values.password.trim();
    }

    onSubmit(payload);
  };

  const title = isViewOnly
    ? 'Chi tiết người dùng'
    : isEdit
      ? 'Cập nhật người dùng'
      : 'Thêm người dùng';

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
          <DialogDescription>Quản lý thông tin tài khoản người dùng trong hệ thống.</DialogDescription>
        </DialogHeader>

        {isLoadingDetail && initialData?.id ? (
          <Loading />
        ) : (
          <form onSubmit={isViewOnly ? (event) => event.preventDefault() : handleSubmit(submitForm)}>
            <fieldset disabled={isViewOnly} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ tên *</Label>
                  <Input id="name" maxLength={255} {...register('name')} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" maxLength={255} {...register('email')} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" maxLength={30} {...register('phone')} />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{isEdit ? 'Mật khẩu mới' : 'Mật khẩu'}</Label>
                  <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
                  {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò *</Label>
                  <select
                    id="role"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('role')}
                  >
                    <option value="">Chọn vai trò</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {USER_ROLE_LABELS[role] || role}
                      </option>
                    ))}
                  </select>
                  {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái *</Label>
                  <select
                    id="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('status')}
                  >
                    <option value="">Chọn trạng thái</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {USER_STATUS_LABELS[status] || status}
                      </option>
                    ))}
                  </select>
                  {errors.status && <p className="text-sm text-destructive">{errors.status.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departmentId">Phòng ban</Label>
                  <select
                    id="departmentId"
                    disabled={isLoadingDepartments}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    {...register('departmentId')}
                  >
                    <option value="">
                      {isLoadingDepartments ? 'Đang tải phòng ban...' : 'Không có'}
                    </option>
                    {departments.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.departmentName || `#${department.id}`}
                      </option>
                    ))}
                  </select>
                </div>
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
