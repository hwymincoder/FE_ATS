import { useMemo, useState } from 'react';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageHeader } from '@/components/shared/page-header';
import { Input } from '@/components/ui/input';
import {
  PipelineStageActions,
  PipelineStageDataTable,
  PipelineStageFormDialog,
} from '@/pages/pipeline-stages/components';
import { DEFAULT_PAGE_SIZE } from '@/pages/pipeline-stages/constants';
import {
  useCreatePipelineStage,
  useDeletePipelineStage,
  useUpdatePipelineStage,
} from '@/pages/pipeline-stages/hooks/usePipelineStageMutations';
import { usePipelineStageList } from '@/pages/pipeline-stages/hooks/usePipelineStageQueries';

export default function PipelineStagesPage() {
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [formMode, setFormMode] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [deletingStage, setDeletingStage] = useState(null);

  const { data, isLoading, isFetching } = usePipelineStageList({
    page: currentPage + 1,
    size: pageSize,
  });

  const filteredStages = useMemo(() => {
    const stages = data?.data ?? [];
    const normalizedKeyword = appliedKeyword.trim().toLowerCase();
    if (!normalizedKeyword) return stages;

    return stages.filter((stage) => stage.stageName?.toLowerCase().includes(normalizedKeyword));
  }, [appliedKeyword, data?.data]);

  const totalItems = appliedKeyword ? filteredStages.length : data?.total ?? 0;
  const pageCount = appliedKeyword
    ? filteredStages.length
      ? 1
      : 0
    : data?.totalPages ?? (totalItems ? Math.ceil(totalItems / pageSize) : 0);

  const createMutation = useCreatePipelineStage({
    onSuccess: () => {
      setFormMode(null);
      setSelectedStage(null);
    },
  });
  const updateMutation = useUpdatePipelineStage({
    onSuccess: () => {
      setFormMode(null);
      setSelectedStage(null);
    },
  });
  const deleteMutation = useDeletePipelineStage({
    onSuccess: () => setDeletingStage(null),
  });

  const handleSearch = () => {
    setAppliedKeyword(keyword);
    setCurrentPage(0);
  };

  const handleReset = () => {
    setKeyword('');
    setAppliedKeyword('');
    setCurrentPage(0);
  };

  const handleAdd = () => {
    setSelectedStage(null);
    setFormMode('create');
  };

  const handleView = (stage) => {
    setSelectedStage(stage);
    setFormMode('view');
  };

  const handleEdit = (stage) => {
    setSelectedStage(stage);
    setFormMode('edit');
  };

  const handleSubmit = (payload) => {
    if (formMode === 'edit' && selectedStage?.id) {
      updateMutation.mutate({ id: selectedStage.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const confirmDelete = () => {
    if (!deletingStage) return;
    deleteMutation.mutate(deletingStage.id);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const formOpen = Boolean(formMode);
  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Giai đoạn tuyển dụng"
        description="Quản lý các giai đoạn xử lý hồ sơ ứng viên"
      />

      <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <label htmlFor="pipeline-stage-keyword" className="text-sm font-medium">
            Từ khóa
          </label>
          <Input
            id="pipeline-stage-keyword"
            maxLength={100}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSearch();
            }}
            placeholder="Tìm theo tên giai đoạn"
          />
        </div>

        <PipelineStageActions
          onSearch={handleSearch}
          onReset={handleReset}
          onAdd={handleAdd}
        />
      </div>

      <PipelineStageDataTable
        data={filteredStages}
        isLoading={isLoading || isFetching}
        pageIndex={appliedKeyword ? 0 : currentPage}
        pageSize={pageSize}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={setDeletingStage}
      />

      {totalItems > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Tổng cộng <span className="font-medium text-foreground">{totalItems}</span> bản ghi
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
                disabled={Boolean(appliedKeyword) || currentPage === 0}
                className="h-9 rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-2">
                Trang {appliedKeyword ? 1 : currentPage + 1} / {pageCount || 1}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={Boolean(appliedKeyword) || currentPage + 1 >= pageCount}
                className="h-9 rounded-md border px-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      <PipelineStageFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFormMode(null);
            setSelectedStage(null);
          }
        }}
        initialData={selectedStage}
        isViewOnly={formMode === 'view'}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={Boolean(deletingStage)}
        onOpenChange={(open) => !open && setDeletingStage(null)}
        title="Xóa giai đoạn tuyển dụng"
        description={
          deletingStage
            ? `Bạn có chắc chắn muốn xóa giai đoạn "${deletingStage.stageName}"?`
            : ''
        }
        confirmText={deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        destructive
      />
    </div>
  );
}
