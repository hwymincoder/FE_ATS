import { ArrowLeft, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { ApplyJobDialog } from './components/ApplyJobDialog';
import { Button } from '@/components/ui/button';
import { JobsSection } from '@/pages/homes/home/components';

export default function JobsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationFilter = useMemo(() => {
    const raw = searchParams.get('location');
    return raw && raw.trim() ? raw.trim() : null;
  }, [searchParams]);

  const [openJob, setOpenJob] = useState(null);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/home')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang chủ
          </Button>
          {locationFilter && (
            <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm">
              <MapPin className="h-4 w-4 text-bv-primary" />
              <span className="font-medium text-foreground">{locationFilter}</span>
            </div>
          )}
        </div>
      </div>

      <JobsSection mode="jobs" onApply={setOpenJob} />

      <ApplyJobDialog
        job={openJob}
        open={!!openJob}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpenJob(null);
        }}
      />

      <footer className="border-t bg-background py-6">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-muted-foreground">
          Nhấn "Quay lại trang chủ" để chọn địa điểm khác.
        </div>
      </footer>
    </div>
  );
}