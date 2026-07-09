import { useState } from 'react';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageHeader } from '@/components/shared/page-header';
import { Input } from '@/components/ui/input';
import {
  DEFAULT_PAGE_SIZE,
  USER_ROLE_LABELS,
  USER_STATUS_LABELS,
} from '@/pages/users/constants';
import { UserActions, UserDataTable, UserFormDialog } from '@/pages/users/components';
import {
  useCreateUser,
  useDeleteUser,
  useToggleUserStatus,
  useUpdateUser,
} from '@/pages/users/hooks/useUserMutations';
import { useUserList, useUserRoles, useUserStatuses } from '@/pages/users/hooks/useUserQueries';

function getDisplayName(user) {
  return user?.name || user?.fullName || user?.email || '';
}

export default function UsersPage() {
  const [keyword, setKeyword] = useState('');
  const [appliedKeyword, setAppliedKeyword] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [formMode, setFormMode] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const { data, isLoading, isFetching } = useUserList({
    page: currentPage + 1,
    size: pageSize,
    keyword: appliedKeyword.trim() || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  });
  const { data: roles = [] } = useUserRoles();
  const { data: statuses = [] } = useUserStatuses();

  const users = data?.data ?? [];
  const totalItems = data?.total ?? 0;
  const pageCount = data?.totalPages ?? (totalItems ? Math.ceil(totalItems / pageSize) : 0);

  const createMutation = useCreateUser({
    onSuccess: () => {
      setFormMode(null);
      setSelectedUser(null);
    },
  });
  const updateMutation = useUpdateUser({
    onSuccess: () => {
      setFormMode(null);
      setSelectedUser(null);
    },
  });
  const deleteMutation = useDeleteUser({
    onSuccess: () => setDeletingUser(null),
  });
  const toggleStatusMutation = useToggleUserStatus();

  const handleSearch = () => {
    setAppliedKeyword(keyword);
    setCurrentPage(0);
  };

  const handleReset = () => {
    setKeyword('');
    setAppliedKeyword('');
    setRoleFilter('');
    setStatusFilter('');
    setCurrentPage(0);
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setFormMode('create');
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setFormMode('view');
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormMode('edit');
  };

  const handleSubmit = (payload) => {
    if (formMode === 'edit' && selectedUser?.id) {
      updateMutation.mutate({ id: selectedUser.id, payload });
      return;
    }

    createMutation.mutate(payload);
  };

  const confirmDelete = () => {
    if (!deletingUser) return;
    deleteMutation.mutate(deletingUser.id);
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const formOpen = Boolean(formMode);
  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader title="Người dùng" description="Quản lý tài khoản người dùng trong hệ thống" />

      <div className="grid gap-3 rounded-lg border p-4 lg:grid-cols-[1fr_220px_220px_auto] lg:items-end">
        <div className="space-y-2">
          <label htmlFor="user-keyword" className="text-sm font-medium">
            Từ khóa
          </label>
          <Input
            id="user-keyword"
            maxLength={255}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSearch();
            }}
            placeholder="Tìm theo họ tên hoặc email"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="user-role" className="text-sm font-medium">
            Vai trò
          </label>
          <select
            id="user-role"
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              setCurrentPage(0);
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Tất cả</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {USER_ROLE_LABELS[role] || role}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="user-status" className="text-sm font-medium">
            Trạng thái
          </label>
          <select
            id="user-status"
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(0);
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Tất cả</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {USER_STATUS_LABELS[status] || status}
              </option>
            ))}
          </select>
        </div>

        <UserActions onSearch={handleSearch} onReset={handleReset} onAdd={handleAdd} />
      </div>

      <UserDataTable
        data={users}
        isLoading={isLoading || isFetching}
        pageIndex={currentPage}
        pageSize={pageSize}
        onView={handleView}
        onEdit={handleEdit}
        onToggleStatus={(user) => toggleStatusMutation.mutate(user.id)}
        onDelete={setDeletingUser}
        togglingId={toggleStatusMutation.isPending ? toggleStatusMutation.variables : null}
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

      <UserFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) {
            setFormMode(null);
            setSelectedUser(null);
          }
        }}
        initialData={selectedUser}
        isViewOnly={formMode === 'view'}
        roles={roles}
        statuses={statuses}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <ConfirmDialog
        open={Boolean(deletingUser)}
        onOpenChange={(open) => !open && setDeletingUser(null)}
        title="Xóa người dùng"
        description={
          deletingUser
            ? `Bạn có chắc chắn muốn xóa người dùng "${getDisplayName(deletingUser)}"?`
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
