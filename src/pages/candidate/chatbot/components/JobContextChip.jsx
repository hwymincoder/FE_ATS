import { MapPin, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function JobContextChip({ jobTitle, onClear, compact = false }) {
  if (!jobTitle) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 rounded-lg border border-primary/20 bg-primary/5',
        compact ? 'px-3 py-2' : 'gap-3 px-4 py-3',
      )}
    >
      <div className={cn('flex min-w-0 items-center gap-2', compact ? 'text-xs' : 'text-sm')}>
        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="line-clamp-2">
          Đang hỏi về: <span className="font-medium text-foreground">{jobTitle}</span>
        </span>
      </div>
      {onClear && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 shrink-0 gap-1 px-2"
          onClick={onClear}
        >
          <X className="h-3.5 w-3.5" />
          Bỏ
        </Button>
      )}
    </div>
  );
}
