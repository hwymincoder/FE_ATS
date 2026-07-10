import { Edit, Eye, PackageOpen, Trash } from 'lucide-react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const currencyFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? currencyFormatter.format(number) : '—';
};

const formatNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString('vi-VN') : '—';
};

export function UpgradePackageDataTable({
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
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12 text-muted-foreground">
        <PackageOpen className="h-10 w-10" />
        <p>Chưa có gói nâng cấp nào</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">STT</TableHead>
            <TableHead>Tên gói</TableHead>
            <TableHead className="w-36">Giá</TableHead>
            <TableHead className="w-36">Quota truy vấn</TableHead>
            <TableHead className="w-24">Ưu tiên</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className="w-32 text-right">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell className="text-center">{pageIndex * pageSize + index + 1}</TableCell>
              <TableCell className="font-medium">{item.packageName}</TableCell>
              <TableCell>{formatCurrency(item.price)}</TableCell>
              <TableCell>{formatNumber(item.numberOfQueryQuota)}</TableCell>
              <TableCell>{item.priority}</TableCell>
              <TableCell>
                <div className="line-clamp-2 max-w-md text-muted-foreground" title={item.description}>
                  {item.description || '—'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onView?.(item)}
                    className="rounded p-1.5 text-blue-600 hover:bg-blue-50"
                    title="Xem"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEdit?.(item)}
                    className="rounded p-1.5 text-yellow-600 hover:bg-yellow-50"
                    title="Cập nhật"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(item)}
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
