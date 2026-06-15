import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Edit, MoreHorizontal, Plus, Search, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { PageHeader } from '@/components/shared/page-header';
import { Loading } from '@/components/shared/loading';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useDeleteDepartment, useDepartmentList } from '@/pages/departments/services/department-queries';
import { DEPARTMENT_ROUTES } from '@/pages/departments/constants';

export default function DepartmentList() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const { data, isLoading } = useDepartmentList();
  const deleteMutation = useDeleteDepartment();

  const list = Array.isArray(data) ? data : [];
  const filtered = keyword
    ? list.filter(
        (d) =>
          d.departmentName?.toLowerCase().includes(keyword.toLowerCase()) ||
          d.description?.toLowerCase().includes(keyword.toLowerCase()),
      )
    : list;

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId, {
        onSettled: () => setDeletingId(null),
      });
    }
  };

  return (
    <div>
      <PageHeader
        title="Phòng ban"
        description="Quản lý danh sách phòng ban trong hệ thống"
        actions={
          <Button onClick={() => navigate(DEPARTMENT_ROUTES.NEW)}>
            <Plus className="mr-2 h-4 w-4" /> Thêm mới
          </Button>
        }
      />

      <Card className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm phòng ban..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
            <Building2 className="h-10 w-10" />
            <p>Chưa có phòng ban nào</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Tên phòng ban</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Phòng ban cha</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.id}</TableCell>
                  <TableCell className="font-medium">{item.departmentName}</TableCell>
                  <TableCell className="text-muted-foreground">{item.description || '—'}</TableCell>
                  <TableCell>{item.parentId ?? '—'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(DEPARTMENT_ROUTES.EDIT(item.id))}>
                          <Edit className="mr-2 h-4 w-4" /> Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingId(item.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
        title="Xóa phòng ban"
        description="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa phòng ban này?"
        confirmText={deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
        onConfirm={handleDelete}
        loading={deleteMutation.isPending}
        destructive
      />
    </div>
  );
}
