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
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

export default function RecruiterJobsPage() {

    const [currentPage] = useState(0);
    const [pageSize] = useState(DEFAULT_PAGE_SIZE);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [deletingJob, setDeletingJob] = useState(null);
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

    const handlePublishJob = (job) => {
        updateMutation.mutate({
            id: job.id,
            payload: {
                departmentId: job.departmentId,
                title: job.title,
                description: job.description,
                location: job.location,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                status: JOB_STATUS.PUBLISHED,
            },
        });
    };

    const handleCloseJob = (job) => {
        updateMutation.mutate({
            id: job.id,
            payload: {
                departmentId: job.departmentId,
                title: job.title,
                description: job.description,
                location: job.location,
                salaryMin: job.salaryMin,
                salaryMax: job.salaryMax,
                status: JOB_STATUS.CLOSED,
            },
        });
    };

    const {data: departments = [], isLoading: isLoadingDepartments } = useRecruiterDepartmentSelection();

    const {data, isLoading, isFetching} = useRecruiterJobList({
        page: currentPage + 1,
        size: pageSize,
    });

    const jobs = data?.data ?? [];

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
                onPublish={handlePublishJob}
                onClose={handleCloseJob}
                publishingId={updateMutation.isPending ? updateMutation.variables?.id : null}
                closingId={updateMutation.isPending ? updateMutation.variables?.id : null}
            />

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
        </div>
    );
}
