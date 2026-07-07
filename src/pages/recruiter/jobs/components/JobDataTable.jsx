import { Briefcase, Edit, Send, Trash, XCircle } from 'lucide-react';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

function formatSalary(min, max) {
    if (min == null && max == null) return '—';
    if (min != null && max != null) {
        return `${min.toLocaleString()} - ${max.toLocaleString()}`;
    }
    if (min != null) return `Từ ${min.toLocaleString()}`;
    return `Đến ${max.toLocaleString()}`;
}

function formatDeadline(deadline) {
    if (!deadline) return '—';

    return new Date(`${deadline}T00:00:00`).toLocaleDateString('vi-VN');
}

function getStatusVariant(status) {
    if (status === 'PUBLISHED') return 'default';
    if (status === 'CLOSED') return 'destructive';
    return 'secondary';
}

function getDepartmentName(departments, departmentId) {
    const department = departments.find((item) => String(item.id) === String(departmentId));
    return department?.departmentName || (departmentId ? `#${departmentId}` : '—');
}

export function JobDataTable({
    data = [],
    departments = [],
    isLoading,
    onEdit,
    onDelete,
    onPublish,
    onClose,
    publishingId,
    closingId,
}) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12 text-muted-foreground">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>Đang tải danh sách job...</span>
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12 text-muted-foreground">
                <Briefcase className="h-10 w-10" />
                <p>Chưa có job nào</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-16 text-center">STT</TableHead>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Phòng ban</TableHead>
                        <TableHead>Địa điểm</TableHead>
                        <TableHead>Lương</TableHead>
                        <TableHead>Hạn ứng tuyển</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="w-36 text-right">Hành động</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((job, index) => (
                        <TableRow key={job.id}>
                            <TableCell className="text-center">{index + 1}</TableCell>
                            <TableCell>
                                <div className="font-medium">{job.title}</div>
                                <div className="line-clamp-1 text-sm text-muted-foreground">
                                    {job.description || '—'}
                                </div>
                            </TableCell>
                            <TableCell>{getDepartmentName(departments, job.departmentId)}</TableCell>
                            <TableCell>{job.location || '—'}</TableCell>
                            <TableCell>{formatSalary(job.salaryMin, job.salaryMax)}</TableCell>
                            <TableCell>{formatDeadline(job.deadline)}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(job.status)}>{job.status}</Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-1">
                                    {job.status === 'DRAFT' && (
                                        <button
                                            type="button"
                                            onClick={() => onPublish?.(job)}
                                            disabled={publishingId === job.id}
                                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            title="Publish job"
                                        >
                                            <Send className="h-4 w-4" />
                                        </button>
                                    )}
                                    {job.status === 'PUBLISHED' && (
                                        <button
                                            type="button"
                                            onClick={() => onClose?.(job)}
                                            disabled={closingId === job.id}
                                            className="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            title="Đóng job"
                                        >
                                            <XCircle className="h-4 w-4" />
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => onEdit?.(job)}
                                        className="rounded p-1.5 text-yellow-600 hover:bg-yellow-50"
                                        title="Cập nhật"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete?.(job)}
                                        className="rounded p-1.5 text-red-600 hover:bg-red-50"
                                        title="Xóa"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
