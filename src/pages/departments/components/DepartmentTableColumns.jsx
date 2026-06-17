import { Edit, Eye, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const createDepartmentColumns = (options = {}) => {
  const { onView, onEdit, onDelete, canUpdate = true, canDelete = true, parentNameMap } = options;

  /** @type {import('@tanstack/react-table').ColumnDef<any>[]} */
  const columns = [
    {
      accessorKey: 'index',
      header: 'STT',
      cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
      enableSorting: false,
      size: 60,
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
      enableSorting: true,
      size: 80,
    },
    {
      accessorKey: 'departmentName',
      header: 'Tên phòng ban',
      enableSorting: true,
      cell: ({ row }) => {
        const name = row.original.departmentName ?? '';
        if (onView) {
          return (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView(row.original);
              }}
              className="text-blue-600 hover:underline font-medium text-left"
            >
              {name}
            </button>
          );
        }
        return <span className="font-medium">{name}</span>;
      },
      size: 240,
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
      enableSorting: false,
      cell: ({ row }) => (
        <div className="text-muted-foreground line-clamp-2 max-w-md" title={row.original.description}>
          {row.original.description || '—'}
        </div>
      ),
      size: 320,
    },
    {
      accessorKey: 'parentId',
      header: 'Phòng ban cha',
      enableSorting: true,
      cell: ({ row }) => {
        const parentId = row.original.parentId;
        if (parentId == null) return <span className="text-muted-foreground">—</span>;
        const parentName = parentNameMap?.get(parentId);
        return (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">#{parentId}</Badge>
            {parentName && <span className="text-muted-foreground">{parentName}</span>}
          </div>
        );
      },
      size: 200,
    },
  ];

  const actionColumn = {
    id: 'actions',
    header: 'Hành động',
    enableSorting: false,
    size: 140,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-1">
          {onView && (
            <button
              type="button"
              onClick={() => onView(item)}
              className="p-1.5 rounded hover:bg-blue-50 text-blue-600"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {canUpdate && onEdit && (
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="p-1.5 rounded hover:bg-yellow-50 text-yellow-600"
              title="Cập nhật"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {canDelete && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item)}
              className="p-1.5 rounded hover:bg-red-50 text-red-600"
              title="Xoá"
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
        </div>
      );
    },
  };

  columns.push(actionColumn);
  return columns;
};
