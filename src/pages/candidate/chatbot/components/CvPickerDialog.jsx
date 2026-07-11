import { FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

function formatCvDate(value) {
  if (!value) return 'Chưa parse';
  return new Date(value).toLocaleString('vi-VN', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function CvPickerDialog({ open, cvs, selectedCvId, onSelect, onConfirm, onClose, loading }) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Chọn CV để so sánh</DialogTitle>
          <DialogDescription>
            Bạn có nhiều CV. Chọn một CV để AI đánh giá mức độ phù hợp với job hiện tại.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 space-y-2 overflow-y-auto">
          {cvs.map((cv) => {
            const isSelected = selectedCvId === cv.id;
            return (
              <button
                key={cv.id}
                type="button"
                onClick={() => onSelect(cv.id)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                  isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50',
                )}
              >
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <div className="truncate font-medium">{cv.fileName || `CV #${cv.id}`}</div>
                  <div className="text-xs text-muted-foreground">
                    {cv.fileType || 'N/A'} · {formatCvDate(cv.parsedAt)}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="button" onClick={onConfirm} disabled={!selectedCvId || loading}>
            Dùng CV này
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
