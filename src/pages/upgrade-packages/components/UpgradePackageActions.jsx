import { Plus, RotateCw, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function UpgradePackageActions({ onSearch, onReset, onAdd, canCreate = true }) {
  return (
    <div className="flex justify-end gap-2">
      <Button onClick={onSearch}>
        <Search className="mr-2 h-4 w-4" />
        Tìm kiếm
      </Button>
      <Button onClick={onReset}>
        <RotateCw className="mr-2 h-4 w-4" />
        Đặt lại
      </Button>
      {canCreate && onAdd && (
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm mới
        </Button>
      )}
    </div>
  );
}
