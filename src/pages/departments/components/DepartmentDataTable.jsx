import { useMemo } from 'react';
import { Building2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { createDepartmentColumns } from './DepartmentTableColumns';


export function DepartmentDataTable({
  data,
  isLoading,
  onView,
  onEdit,
  onDelete,
  canUpdate = true,
  canDelete = true,
  parentNameMap,
}) {
  const columns = useMemo(
    () => createDepartmentColumns({ onView, onEdit, onDelete, canUpdate, canDelete, parentNameMap }),
    [onView, onEdit, onDelete, canUpdate, canDelete, parentNameMap],
  );

  if (isLoading) {
    return (
      <div className="border rounded-lg p-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border rounded-lg p-12 flex flex-col items-center justify-center gap-2 text-muted-foreground">
        <Building2 className="h-10 w-10" />
        <p>Chưa có phòng ban nào</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.accessorKey || col.id} style={{ width: col.size }}>
                {typeof col.header === 'string' ? col.header : null}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow key={row.id ?? rowIndex}>
              {columns.map((col) => (
                <TableCell key={col.accessorKey || col.id}>
                  {col.cell
                    ? col.cell({ row: { original: row, index: rowIndex } })
                    : (row[col.accessorKey] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
