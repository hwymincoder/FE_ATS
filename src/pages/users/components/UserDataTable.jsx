import { Edit, Eye, Trash, Users } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { USER_ROLE_LABELS } from '@/pages/users/constants';

function getDepartmentName(user) {
  return user.departmentName || user.department?.departmentName || user.departmentId?.departmentName || user.departmentId || '-';
}

function isActiveStatus(status) {
  return status === 'ACTIVE';
}

export function UserDataTable({
  data = [],
  isLoading,
  pageIndex = 0,
  pageSize = 10,
  onView,
  onEdit,
  onToggleStatus,
  onDelete,
  togglingId,
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12 text-muted-foreground">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span>Đang tải danh sách người dùng...</span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12 text-muted-foreground">
        <Users className="h-10 w-10" />
        <p>Chưa có người dùng nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">STT</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Số điện thoại</TableHead>
            <TableHead>Phòng ban</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-28 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell className="text-center">{pageIndex * pageSize + index + 1}</TableCell>
              <TableCell className="font-medium">{user.name || user.fullName || '-'}</TableCell>
              <TableCell>{user.email || '-'}</TableCell>
              <TableCell>{user.phone || '-'}</TableCell>
              <TableCell>{getDepartmentName(user)}</TableCell>
              <TableCell>{USER_ROLE_LABELS[user.role] || user.role || '-'}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isActiveStatus(user.status)}
                    aria-label={isActiveStatus(user.status) ? 'Tắt hoạt động' : 'Bật hoạt động'}
                    onClick={() => onToggleStatus?.(user)}
                    disabled={togglingId === user.id}
                    className={[
                      'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                      'disabled:cursor-not-allowed disabled:opacity-50',
                      isActiveStatus(user.status) ? 'bg-primary' : 'bg-muted-foreground/30',
                    ].join(' ')}
                    title={isActiveStatus(user.status) ? 'Tắt hoạt động' : 'Bật hoạt động'}
                  >
                    <span
                      className={[
                        'inline-block h-5 w-5 rounded-full bg-background shadow transition-transform',
                        isActiveStatus(user.status) ? 'translate-x-5' : 'translate-x-0.5',
                      ].join(' ')}
                    />
                  </button>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onView?.(user)}
                    className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                    title="Xem"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit?.(user)}
                    className="rounded p-1.5 text-yellow-600 hover:bg-yellow-50"
                    title="Cập nhật"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(user)}
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
