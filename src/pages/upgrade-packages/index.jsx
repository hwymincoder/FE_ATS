import { useMemo, useState } from 'react';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageHeader } from '@/components/shared/page-header';
import { Input } from '@/components/ui/input';
import {
  UpgradePackageActions,
  UpgradePackageDataTable,
  UpgradePackageFormDialog,
} from '@/pages/upgrade-packages/components';
import { DEFAULT_PAGE_SIZE } from '@/pages/upgrade-packages/constants';
import {
  useCreateUpgradePackage,
  useDeleteUpgradePackage,
  useUpdateUpgradePackage,
} from '@/pages/upgrade-packages/hooks/useUpgradePackageMutations';
import { useUpgradePackageList } from '@/pages/upgrade-packages/hooks/useUpgradePackageQueries';

export default function UpgradePackagePage() {
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [formMode, setFormMode] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [deletingPackage, setDeletingPackage] = useState(null);

  const { data, isLoading, isFetching } = useUpgradePackageList({
    page: currentPage + 1,
    size: pageSize,
  });

  const filteredPackages = useMemo(() => {
    const packages = data?.data ?? [];
    const normalizedKeyword = appliedKeyword.trim().toLowerCase();
    if (!normalizedKeyword) return packages;

    return packages.filter((item) => {
      const packageName = item.packageName?.toLowerCase() ?? '';
      const description = item.description?.toLowerCase() ?? '';
      return packageName.includes(normalizedKeyword) || description.includes(normalizedKeyword);
    });
  }, [appliedKeyword, data?.data]);

  const totalItems = appliedKeyword ? filteredPackages.length : data?.total ?? 0;
  const pageCount = appliedKeyword
    ? filteredPackages.length
      ? 1
      : 0
    : data?.totalPages ?? (totalItems ? Math.ceil(totalItems / pageSize) : 0);

  const createMutation = useCreateUpgradePackage({
    onSuccess: () => {
      setFormMode(null);
      setSelectedPackage(null);
    },
  });
  const updateMutation = useUpdateUpgradePackage({
    onSuccess: () => {
      setFormMode(null);
      setSelectedPackage(null);
    },
  });
  const deleteMutation = useDeleteUpgradePackage({
    onSuccess: () => setDeletingPackage(null),
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
    setSelectedPackage(null);
    setFormMode('create');
  };

  const handleView = (item) => {
    setSelectedPackage(item);
    setFormMode('view');
  };

  const handleEdit = (item) => {
    setSelectedPackage(item);
    setFormMode('edit');
  };

  const handleSubmit = (payload) => {
    if (formMode === 'edit' && selectedPackage?.id) {
      updateMutation.mutate({ id: selectedPackage.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const confirmDelete = () => {
    if (!deletingPackage) return;
    deleteMutation.mutate(deletingPackage.id);
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
        title="Gói nâng cấp"
        description="Quản lý danh sách gói VIP và quota truy vấn trong hệ thống"
      />

      <div className="grid gap-3 rounded-lg border p-4 md:grid-cols-[1fr_auto] md:items-end">
        <div className="space-y-2">
          <label htmlFor="upgrade-package-keyword" className="text-sm font-medium">
            Từ khóa
          </label>
          <Input
            id="upgrade-package-keyword"
            maxLength={100}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSearch();
            }}
            placeholder="Tìm theo tên hoặc mô tả gói"
          />
        </div>

        <UpgradePackageActions onSearch={handleSearch} onReset={handleReset} onAdd={handleAdd} />
      </div>

      <UpgradePackageDataTable
        data={filteredPackages}
        isLoading={isLoading || isFetching}
        pageIndex={appliedKeyword ? 0 : currentPage}
        pageSize={pageSize}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={setDeletingPackage}
      />

      {totalItems > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Tổng cộng <span className="font-medium text-foreground">{totalItems}</span> bản ghi
          </div>
          <div className="flex items-center gap-2">
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="h-9 rounded-md border bg-background px-2 text-sm"
            >
              {[10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>
                  {n}/trang
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

      <UpgradePackageFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFormMode(null);
            setSelectedPackage(null);
          }
        }}
        initialData={selectedPackage}
        isViewOnly={formMode === 'view'}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={Boolean(deletingPackage)}
        onOpenChange={(open) => !open && setDeletingPackage(null)}
        title="Xoá gói nâng cấp"
        description={
          deletingPackage
            ? `Bạn có chắc chắn muốn xóa gói "${deletingPackage.packageName}"?`
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
