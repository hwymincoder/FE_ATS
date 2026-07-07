import {PageHeader} from '@/components/shared/page-header';
import { useState } from 'react';
import { DEFAULT_PAGE_SIZE, JOB_STATUS } from './constants';
import { useRecruiterJobList } from './hooks/useRecruiterJobQueries';
import { JobDataTable } from './components/JobDataTable';
import {
    useCreateRecruiterJob,
    useDeleteRecruiterJob,
    useUpdateRecruiterJob,
} from './hooks/useRecruiterJobMutations';
import JobActions from './components/JobActions';
import { JobFormDialog } from './components/JobFormDialog';
import { useRecruiterDepartmentSelection } from './hooks/useRecruiterDepartmentQueries';
import { useVietnamProvinces } from './hooks/useRecruiterLocationQueries';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

export default function RecruiterJobsPage() {

    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [deletingJob, setDeletingJob] = useState(null);
    const [publishingJob, setPublishingJob] = useState(null);
    const [closingJob, setClosingJob] = useState(null);
    const createMutation = useCreateRecruiterJob({
        onSuccess: () => {
            setIsFormOpen(false);
            setEditingJob(null);
        },
    });
    const updateMutation = useUpdateRecruiterJob({
        onSuccess: () => {
            setIsFormOpen(false);
            setEditingJob(null);
            setPublishingJob(null);
            setClosingJob(null);
        },
    });
    const deleteMutation = useDeleteRecruiterJob({
        onSuccess: () => setDeletingJob(null),
    });

    const handleAdd = () => {
        setEditingJob(null);
        setIsFormOpen(true);
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setIsFormOpen(true);
    };

    const handleSubmitJob = (payload) => {
        if (editingJob) {
            updateMutation.mutate({ id: editingJob.id, payload });
            return;
        }
        createMutation.mutate(payload);
    };

    const handleDeleteJob = () => {
        if (!deletingJob) return;
        deleteMutation.mutate(deletingJob.id);
    };

    const buildStatusPayload = (job, status) => ({
        departmentId: job.departmentId,
        title: job.title,
        description: job.description,
        location: job.location,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        deadline: job.deadline,
        status,
    });

    const confirmPublishJob = () => {
        if (!publishingJob) return;

        updateMutation.mutate({
            id: publishingJob.id,
            payload: buildStatusPayload(publishingJob, JOB_STATUS.PUBLISHED),
        });
    };

    const confirmCloseJob = () => {
        if (!closingJob) return;

        updateMutation.mutate({
            id: closingJob.id,
            payload: buildStatusPayload(closingJob, JOB_STATUS.CLOSED),
        });
    };

    const {data: departments = [], isLoading: isLoadingDepartments } = useRecruiterDepartmentSelection();
    const {data: provinces = [], isLoading: isLoadingProvinces } = useVietnamProvinces();

    const {data, isLoading, isFetching} = useRecruiterJobList({
        page: currentPage + 1,
        size: pageSize,
    });

    const jobs = data?.data ?? [];
    const totalItems = data?.total ?? 0;
    const pageCount = data?.totalPages ?? (totalItems ? Math.ceil(totalItems / pageSize) : 0);

    const handlePageChange = (pageIndex) => {
        setCurrentPage(pageIndex);
    };

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(0);
    };

    return (
        <div className= "space-y-6">
            <PageHeader title="Quản lý Job" description="Tạo, cập nhật và publish tin tuyển dụng"/>

            <JobActions onAdd={handleAdd} />
            <JobDataTable
                data={jobs}
                departments={departments}
                isLoading={isLoading || isFetching}
                onEdit={handleEdit}
                onDelete={setDeletingJob}
                onPublish={setPublishingJob}
                onClose={setClosingJob}
                publishingId={updateMutation.isPending ? updateMutation.variables?.id : null}
                closingId={updateMutation.isPending ? updateMutation.variables?.id : null}
            />

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
                                onClick={() => handlePageChange(currentPage - 1)}
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
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage + 1 >= pageCount}
                                className="h-9 rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <JobFormDialog
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingJob(null);
                }}
                onSubmit={handleSubmitJob}
                submitting={createMutation.isPending || updateMutation.isPending}
                departments={departments}
                isLoadingDepartments={isLoadingDepartments}
                provinces={provinces}
                isLoadingProvinces={isLoadingProvinces}
                initialData={editingJob}
            />

            <ConfirmDialog
                open={Boolean(deletingJob)}
                onOpenChange={(open) => !open && setDeletingJob(null)}
                title="Xóa job"
                description={
                    deletingJob
                        ? `Bạn có chắc chắn muốn xóa job "${deletingJob.title}"?`
                        : ''
                }
                confirmText={deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
                onConfirm={handleDeleteJob}
                loading={deleteMutation.isPending}
                destructive
            />

            <ConfirmDialog
                open={Boolean(publishingJob)}
                onOpenChange={(open) => !open && setPublishingJob(null)}
                title="Publish job"
                description={
                    publishingJob
                        ? `Bạn có chắc chắn muốn publish job "${publishingJob.title}"? Job sẽ hiển thị ra public.`
                        : ''
                }
                confirmText={updateMutation.isPending ? 'Đang publish...' : 'Publish'}
                onConfirm={confirmPublishJob}
                loading={updateMutation.isPending}
            />

            <ConfirmDialog
                open={Boolean(closingJob)}
                onOpenChange={(open) => !open && setClosingJob(null)}
                title="Đóng job"
                description={
                    closingJob
                        ? `Bạn có chắc chắn muốn đóng job "${closingJob.title}"? Ứng viên sẽ không còn ứng tuyển job này.`
                        : ''
                }
                confirmText={updateMutation.isPending ? 'Đang đóng...' : 'Đóng job'}
                onConfirm={confirmCloseJob}
                loading={updateMutation.isPending}
                destructive
            />
        </div>
    );
}
