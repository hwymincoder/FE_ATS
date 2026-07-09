import { Edit, Eye, GitBranch, Trash } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function PipelineStageDataTable({
  data = [],
  isLoading,
  pageIndex = 0,
  pageSize = 10,
  onView,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12 text-muted-foreground">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span>Đang tải danh sách giai đoạn...</span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12 text-muted-foreground">
        <GitBranch className="h-10 w-10" />
        <p>Chưa có giai đoạn tuyển dụng nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">STT</TableHead>
            <TableHead>Tên giai đoạn</TableHead>
            <TableHead className="w-40">Thứ tự</TableHead>
            <TableHead className="w-32 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((stage, index) => (
            <TableRow key={stage.id}>
              <TableCell className="text-center">{pageIndex * pageSize + index + 1}</TableCell>
              <TableCell className="font-medium">{stage.stageName}</TableCell>
              <TableCell>{stage.stageOrder}</TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onView?.(stage)}
                    className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                    title="Xem"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit?.(stage)}
                    className="rounded p-1.5 text-yellow-600 hover:bg-yellow-50"
                    title="Cập nhật"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(stage)}
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
