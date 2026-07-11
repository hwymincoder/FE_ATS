import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

export function QuotaBadge({ quota }) {
  const value = Number(quota ?? 0);

  return (
    <Badge variant={value > 0 ? 'secondary' : 'destructive'} className="gap-1">
      <Sparkles className="h-3.5 w-3.5" />
      Còn {value} lượt
    </Badge>
  );
}
