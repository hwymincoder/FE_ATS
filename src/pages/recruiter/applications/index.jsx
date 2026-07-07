import { useState } from 'react';
import { CalendarDays, MapPin, Users } from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { DEFAULT_PAGE_SIZE, JOB_STATUS } from '@/pages/recruiter/jobs/constants';
import { useRecruiterJobList } from '@/pages/recruiter/jobs/hooks/useRecruiterJobQueries';

function formatDate(date) {
    if (!date) return '—';

    return new Date(`${date}T00:00:00`).toLocaleDateString('vi-VN');
}

function formatSalary(min, max) {
    if (min == null && max == null) return 'Thỏa thuận';
    if (min != null && max != null) return `${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min != null) return `Từ ${min.toLocaleString()}`;

    return `Đến ${max.toLocaleString()}`;
}

function PublishedJobCard({ job }) {
    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <CardTitle className="line-clamp-2 text-lg leading-6">{job.title}</CardTitle>
                    <Badge>PUBLISHED</Badge>
                </div>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                    {job.description || 'Chưa có mô tả'}
                </p>
            </CardHeader>

            <CardContent className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{job.location || 'Chưa cập nhật địa điểm'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>Hạn ứng tuyển: {formatDate(job.deadline)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                        <span className="font-medium text-foreground">{job.applicationCount ?? 0}</span>{' '}
                        người đã apply
                    </span>
                </div>
                <div className="rounded-md bg-muted px-3 py-2 text-sm font-medium">
                    {formatSalary(job.salaryMin, job.salaryMax)}
                </div>
            </CardContent>

            <CardFooter>
                <Button variant="outline" className="w-full" disabled>
                    Xem Kanban
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function RecruiterApplicationsPage() {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const { data, isLoading, isFetching } = useRecruiterJobList({
        page: currentPage + 1,
        size: pageSize,
        status: JOB_STATUS.PUBLISHED,
    });

    const jobs = data?.data ?? [];
    const totalItems = data?.total ?? 0;
    const pageCount = data?.totalPages ?? (totalItems ? Math.ceil(totalItems / pageSize) : 0);

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Applications"
                description="Theo dõi các job đã publish và số lượng hồ sơ ứng tuyển"
            />

            {(isLoading || isFetching) && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12 text-muted-foreground">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Đang tải danh sách job đã publish...</span>
                </div>
            )}

            {!isLoading && !isFetching && !jobs.length && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12 text-muted-foreground">
                    <Users className="h-10 w-10" />
                    <p>Chưa có job đã publish</p>
                </div>
            )}

            {!isLoading && !isFetching && jobs.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {jobs.map((job) => (
                        <PublishedJobCard key={job.id} job={job} />
                    ))}
                </div>
            )}

            {totalItems > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                        Tổng cộng <span className="font-medium text-foreground">{totalItems}</span> job
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={pageSize}
                            onChange={(event) => handlePageSizeChange(Number(event.target.value))}
                            className="h-9 rounded-md border bg-background px-2 text-sm"
                        >
                            {[10, 20, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}/trang
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 0}
                                className="h-9 rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Trước
                            </button>
                            <span className="px-2">
                                Trang {currentPage + 1} / {pageCount || 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage + 1 >= pageCount}
                                className="h-9 rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
