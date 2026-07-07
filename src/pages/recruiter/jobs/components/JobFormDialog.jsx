import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';

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
import { JOB_STATUS } from '@/pages/recruiter/jobs/constants';

const optionalNumber = z.preprocess(
    (value) => (value === '' || value == null ? undefined : Number(value)),
    z.number().optional(),
);

const jobSchema = z
    .object({
        departmentId: z.coerce.number().min(1, 'Vui lòng nhập phòng ban'),
        title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
        description: z.string().optional().default(''),
        location: z.string().optional().default(''),
        salaryMin: optionalNumber,
        salaryMax: optionalNumber,
    })
    .refine(
        (values) => {
            if (values.salaryMin == null || values.salaryMax == null) return true;
            return values.salaryMin <= values.salaryMax;
        },
        {
            message: 'Lương tối thiểu phải nhỏ hơn hoặc bằng lương tối đa',
            path: ['salaryMax'],
        },
    );

export function JobFormDialog({
    open,
    onOpenChange,
    onSubmit,
    submitting,
    departments = [],
    isLoadingDepartments = false,
    initialData = null,
}) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            departmentId: '',
            title: '',
            description: '',
            location: '',
            salaryMin: '',
            salaryMax: '',
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                departmentId: initialData?.departmentId ?? '',
                title: initialData?.title ?? '',
                description: initialData?.description ?? '',
                location: initialData?.location ?? '',
                salaryMin: initialData?.salaryMin ?? '',
                salaryMax: initialData?.salaryMax ?? '',
            });
        }
    }, [initialData, open, reset]);

    const submitForm = (values) => {
        onSubmit({
            ...values,
            salaryMin: values.salaryMin ?? null,
            salaryMax: values.salaryMax ?? null,
            status: initialData?.status ?? JOB_STATUS.DRAFT,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{initialData ? 'Cập nhật job' : 'Thêm job'}</DialogTitle>
                    <DialogDescription>
                        {initialData
                            ? 'Cập nhật thông tin tin tuyển dụng'
                            : 'Tạo tin tuyển dụng mới ở trạng thái nháp'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Tiêu đề *</Label>
                        <Input id="title" placeholder="VD: Frontend Developer" {...register('title')} />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="departmentId">Phòng ban *</Label>
                        <select
                            id="departmentId"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isLoadingDepartments}
                            {...register('departmentId')}
                        >
                            <option value="">
                                {isLoadingDepartments ? 'Đang tải phòng ban...' : 'Chọn phòng ban'}
                            </option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.id}>
                                    {department.departmentName || `#${department.id}`}
                                </option>
                            ))}
                        </select>
                        {errors.departmentId && (
                            <p className="text-sm text-destructive">{errors.departmentId.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Địa điểm</Label>
                        <Input id="location" placeholder="VD: Hà Nội" {...register('location')} />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="salaryMin">Lương tối thiểu</Label>
                            <Input id="salaryMin" type="number" {...register('salaryMin')} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="salaryMax">Lương tối đa</Label>
                            <Input id="salaryMax" type="number" {...register('salaryMax')} />
                            {errors.salaryMax && (
                                <p className="text-sm text-destructive">{errors.salaryMax.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            placeholder="Mô tả công việc"
                            {...register('description')}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={submitting}
                        >
                            Hủy
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            <Save className="mr-2 h-4 w-4" />
                            {submitting ? 'Đang lưu...' : initialData ? 'Cập nhật' : 'Lưu'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
