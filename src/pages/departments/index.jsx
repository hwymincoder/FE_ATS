import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { PageHeader } from '@/components/shared/page-header';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import {
  DepartmentSearchForm,
  DepartmentActions,
  DepartmentDataTable,
  DepartmentFormDialog,
} from '@/pages/departments/components';
import {
  useDepartmentList,
  useDeleteDepartment,
} from '@/pages/departments/hooks';
import { DEFAULT_PAGE_SIZE, DEPARTMENT_QUERY_KEYS } from '@/pages/departments/constants';

export default function DepartmentPage() {
  const queryClient = useQueryClient();
  const searchFormRef = useRef(null);

  // ── State tìm kiếm / phân trang ─────────────────────────────────────
  const [searchCriteria, setSearchCriteria] = useState({ keyword: undefined });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // ── State dialog Thêm / Sửa / Xem ───────────────────────────────────
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isViewOnly, setIsViewOnly] = useState(false);

  // ── State xác nhận xoá ────────────────────────────────────────────────
  const [deletingItem, setDeletingItem] = useState(null);

  // ── Lấy danh sách ────────────────────────────────────────────────────
  const requestParams = useMemo(
    () => ({
      ...searchCriteria,
      page: currentPage + 1,
      pageSize,
    }),
    [searchCriteria, currentPage, pageSize],
  );

  const { data, isLoading, isFetching } = useDepartmentList(requestParams);
  const list = data?.data ?? [];
  const totalItems = data?.total ?? 0;
  const pageCount = totalItems ? Math.ceil(totalItems / pageSize) : 0;

  const parentNameMap = useMemo(() => {
    const map = new Map();
    list.forEach((d) => {
      if (d.id != null) map.set(d.id, d.departmentName ?? `#${d.id}`);
    });
    return map;
  }, [list]);

  // ── Mutations ────────────────────────────────────────────────────────
  const deleteMutation = useDeleteDepartment();

  // ── Handlers tìm kiếm ────────────────────────────────────────────────
  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
    setCurrentPage(0);
  };
  const handleSearchClick = () => searchFormRef.current?.submitForm();
  const handleReset = () => {
    searchFormRef.current?.resetForm();
    setSearchCriteria({ keyword: undefined });
    setCurrentPage(0);
  };

  // ── Handlers phân trang ──────────────────────────────────────────────
  const handlePageChange = (pageIndex) => setCurrentPage(pageIndex);
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  // ── Handlers dialog Form ─────────────────────────────────────────────
  const handleAdd = () => {
    setEditingItem(null);
    setIsViewOnly(false);
    setIsFormDialogOpen(true);
  };
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsViewOnly(false);
    setIsFormDialogOpen(true);
  };
  const handleView = (item) => {
    setEditingItem(item);
    setIsViewOnly(true);
    setIsFormDialogOpen(true);
  };
  const handleFormDialogChange = (open) => {
    setIsFormDialogOpen(open);
    if (!open) setEditingItem(null);
  };

  // ── Handler xoá ──────────────────────────────────────────────────────
  const handleDelete = (item) => setDeletingItem(item);
  const confirmDelete = () => {
    if (!deletingItem) return;
    deleteMutation.mutate(deletingItem.id, {
      onSettled: () => setDeletingItem(null),
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Phòng ban"
        description="Quản lý danh sách phòng ban trong hệ thống"
      />

      <DepartmentSearchForm ref={searchFormRef} onSearch={handleSearch} />

      <DepartmentActions
        onSearch={handleSearchClick}
        onReset={handleReset}
        onAdd={handleAdd}
      />

      <DepartmentDataTable
        data={list}
        isLoading={isLoading || isFetching}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        parentNameMap={parentNameMap}
      />

      {/* Phân trang đơn giản — dựng lại bằng tay để không phụ thuộc DataTable component ngoài */}
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
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="h-9 rounded-md border px-3 text-sm disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-2">
                Trang {currentPage + 1} / {pageCount}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage + 1 >= pageCount}
                className="h-9 rounded-md border px-3 text-sm disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      <DepartmentFormDialog
        open={isFormDialogOpen}
        onOpenChange={handleFormDialogChange}
        initialData={editingItem}
        isEdit={Boolean(editingItem) && !isViewOnly}
        isViewOnly={isViewOnly}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.lists() });
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingItem)}
        onOpenChange={(open) => !open && setDeletingItem(null)}
        title="Xoá phòng ban"
        description={
          deletingItem
            ? `Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xoá phòng ban "${deletingItem.departmentName}"?`
            : ''
        }
        confirmText={deleteMutation.isPending ? 'Đang xoá...' : 'Xoá'}
        onConfirm={confirmDelete}
        loading={deleteMutation.isPending}
        destructive
      />
    </div>
  );
}
