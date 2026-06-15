import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { PageHeader } from '@/components/shared/page-header';
import { Loading } from '@/components/shared/loading';
import { useCreateDepartment, useDepartmentById, useUpdateDepartment } from '@/pages/departments/services/department-queries';
import { DEPARTMENT_ROUTES } from '@/pages/departments/constants';

const departmentSchema = z.object({
  departmentName: z.string().min(1, 'Vui lòng nhập tên phòng ban'),
  description: z.string().optional().default(''),
  parentId: z
    .union([z.string(), z.number()])
    .optional()
    .transform((v) => (v === '' || v == null ? null : Number(v))),
});

export default function DepartmentForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(departmentSchema),
    defaultValues: { departmentName: '', description: '', parentId: '' },
  });

  const { data: detail, isLoading } = useDepartmentById(id);
  const createMutation = useCreateDepartment({
    onSuccess: () => navigate(DEPARTMENT_ROUTES.LIST),
  });
  const updateMutation = useUpdateDepartment(id, {
    onSuccess: () => navigate(DEPARTMENT_ROUTES.LIST),
  });

  useEffect(() => {
    if (isEdit && detail) {
      reset({
        departmentName: detail.departmentName || '',
        description: detail.description || '',
        parentId: detail.parentId ?? '',
      });
    }
  }, [isEdit, detail, reset]);

  const onSubmit = (values) => {
    const payload = {
      departmentName: values.departmentName,
      description: values.description,
      parentId: values.parentId || null,
    };
    if (isEdit) updateMutation.mutate(payload);
    else createMutation.mutate(payload);
  };

  if (isEdit && isLoading) return <Loading />;
  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <PageHeader
        title={isEdit ? 'Sửa phòng ban' : 'Thêm phòng ban'}
        description={isEdit ? 'Cập nhật thông tin phòng ban' : 'Tạo mới phòng ban trong hệ thống'}
      />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Thông tin phòng ban</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="departmentName">Tên phòng ban</Label>
              <Input id="departmentName" placeholder="VD: Phòng IT" {...register('departmentName')} />
              {errors.departmentName && (
                <p className="text-sm text-destructive">{errors.departmentName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="parentId">ID phòng ban cha (tùy chọn)</Label>
              <Input id="parentId" type="number" placeholder="VD: 1" {...register('parentId')} />
              {errors.parentId && (
                <p className="text-sm text-destructive">{errors.parentId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea id="description" rows={3} placeholder="Mô tả phòng ban" {...register('description')} />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" disabled={submitting}>
                <Save className="mr-2 h-4 w-4" />
                {submitting ? 'Đang lưu...' : 'Lưu'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(DEPARTMENT_ROUTES.LIST)}
                disabled={submitting}
              >
                Hủy
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
