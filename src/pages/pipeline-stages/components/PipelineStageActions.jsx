import { Plus, RotateCw, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';

export function PipelineStageActions({ onSearch, onReset, onAdd, canCreate = true }) {
  return (
    <div className="flex justify-end gap-2">
      <Button onClick={onSearch} variant="default">
        <Search className="mr-2 h-4 w-4" />
        Tìm kiếm
      </Button>
      <Button onClick={onReset} variant="default">
        <RotateCw className="mr-2 h-4 w-4" />
        Đặt lại
      </Button>
      {canCreate && onAdd && (
        <Button onClick={onAdd} variant="default">
          <Plus className="mr-2 h-4 w-4" />
          Thêm mới
        </Button>
      )}
    </div>
  );
}
