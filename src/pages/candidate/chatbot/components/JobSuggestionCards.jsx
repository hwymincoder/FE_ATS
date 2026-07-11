import { ArrowRight, Building2, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

function formatSalaryRange(min, max) {
  const format = (value) =>
    value == null ? null : `${Number(value).toLocaleString('vi-VN')} triệu`;
  const minText = format(min);
  const maxText = format(max);
  if (minText && maxText) return `${minText} - ${maxText}`;
  return minText || maxText || null;
}

export function JobSuggestionCards({ jobs, widget = false, onApply }) {
  if (!jobs?.length) return null;

  return (
    <div className={cn('grid gap-2', widget ? 'grid-cols-1' : 'gap-3 sm:grid-cols-2')}>
      {jobs.map((job) => {
        const salaryText = formatSalaryRange(job.salaryMin, job.salaryMax);
        return (
          <Card key={job.id} className="border-dashed shadow-none">
            <CardHeader className={cn('space-y-1', widget ? 'p-3 pb-1' : 'space-y-2 p-4 pb-2')}>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className={cn('line-clamp-2', widget ? 'text-sm' : 'text-base')}>
                  {job.title}
                </CardTitle>
                {job.status && <Badge variant="secondary">{job.status}</Badge>}
              </div>
            </CardHeader>
            <CardContent
              className={cn(
                'space-y-2 text-muted-foreground',
                widget ? 'p-3 pt-0 text-xs' : 'space-y-2 p-4 pt-0 text-sm',
              )}
            >
              {job.department && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{job.department}</span>
                </div>
              )}
              {job.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="truncate">{job.location}</span>
                </div>
              )}
              {salaryText && <div className="font-medium text-foreground">{salaryText}</div>}
              {onApply && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="mt-1 w-full gap-2"
                  onClick={() => onApply(job)}
                >
                  Ứng tuyển
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
