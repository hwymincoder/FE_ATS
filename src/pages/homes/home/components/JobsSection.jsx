import { ArrowRight, Building2, MapPin, MessageSquare } from 'lucide-react';
import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Loading } from '@/components/shared/loading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/configs/routes';
import { ROLES } from '@/constants';
import { useAuth } from '@/hooks/use-auth';
import { useChatbotStore } from '@/stores/chatbot-store';
import { useAllPostedJobs } from '@/pages/homes/home/services/job-queries';
import { cn } from '@/lib/utils';
import SectionTitle from './SectionTitle';

const STATUS_LABEL = {
  PUBLISHED: 'Đang tuyển',
};

function formatSalary(value) {
  if (value == null) return null;
  return `${Number(value).toLocaleString('vi-VN')} triệu`;
}

function formatSalaryRange(min, max) {
  const minText = formatSalary(min);
  const maxText = formatSalary(max);
  if (minText && maxText) return `${minText} - ${maxText}`;
  return minText || maxText;
}

function groupJobsByLocation(jobs) {
  const map = new Map();
  for (const job of jobs) {
    const key = (job.location || 'Toàn quốc').trim() || 'Toàn quốc';
    const entry = map.get(key);
    if (entry) {
      entry.count += 1;
    } else {
      map.set(key, { name: key, count: 1 });
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

function LocationsGrid({ jobs, isLoading, isError }) {
  const navigate = useNavigate();
  const groups = useMemo(() => groupJobsByLocation(jobs), [jobs]);
  const grandTotal = useMemo(() => jobs.length, [jobs]);
  const totalLocations = groups.length;

  if (isLoading) {
    return <Loading text="Đang tải địa điểm..." />;
  }
  if (isError || totalLocations === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Hiện chưa có vị trí nào đang mở tuyển.
      </p>
    );
  }

  return (
    <>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Đang mở tuyển tại <span className="font-semibold text-foreground">{totalLocations}</span> địa điểm
        với <span className="font-semibold text-foreground">{grandTotal}</span> vị trí. Chọn địa điểm để xem
        chi tiết.
      </p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((loc, idx) => {
          const gradient = [
            'from-bv-primary to-bv-secondary',
            'from-bv-secondary to-bv-accent',
            'from-bv-accent to-bv-primary',
          ][idx % 3];
          return (
            <Card
              key={loc.name}
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate(`/home/jobs?location=${encodeURIComponent(loc.name)}`)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/home/jobs?location=${encodeURIComponent(loc.name)}`);
                }
              }}
              className="group relative cursor-pointer overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_hsl(var(--bv-primary)/0.3)]"
            >
              <div className={cn('h-1.5 w-full bg-gradient-to-r', gradient)} />
              <CardHeader className="pb-2">
                <div
                  className={cn(
                    'mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-white',
                    gradient,
                  )}
                >
                  <MapPin className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg leading-snug">{loc.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="font-medium">
                    {loc.count} vị trí
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-bv-primary transition-transform group-hover:translate-x-1">
                    Xem chi tiết
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function JobsGrid({ jobs, isLoading, isError, onApply }) {
  const navigate = useNavigate();
  const { user, accessToken } = useAuth();
  const openChat = useChatbotStore((s) => s.openChat);

  const handleAskAi = (job) => {
    const chatContext = {
      jobId: job.id,
      jobTitle: job.title || `Job #${job.id}`,
    };

    if (user?.role === ROLES.CANDIDATE && accessToken) {
      openChat(chatContext);
      return;
    }

    navigate(ROUTES.CANDIDATE_LOGIN, {
      state: {
        chatContext,
        from: ROUTES.HOME,
      },
    });
  };

  if (isLoading) {
    return <Loading text="Đang tải vị trí..." />;
  }
  if (isError || jobs.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Không có vị trí nào phù hợp với bộ lọc hiện tại.
      </p>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {jobs.map((job, idx) => {
        const topBar = [
          'bg-gradient-to-r from-bv-primary to-bv-secondary',
          'bg-gradient-to-r from-bv-secondary to-bv-accent',
          'bg-gradient-to-r from-bv-accent to-bv-primary',
        ][idx % 3];
        const badgeClass = [
          'bg-gradient-to-r from-bv-primary to-bv-secondary',
          'bg-gradient-to-r from-bv-secondary to-bv-accent text-bv-primary',
          'bg-gradient-to-r from-bv-accent to-bv-primary',
        ][idx % 3];
        const statusText = STATUS_LABEL[job.status] || 'Mở';
        const salaryText = formatSalaryRange(job.salaryMin, job.salaryMax);
        return (
          <Card
            key={job.id}
            className="group flex flex-col overflow-hidden border-border/60 transition-all hover:-translate-y-1 hover:shadow-[0_12px_32px_-12px_hsl(var(--bv-primary)/0.3)]"
          >
            <div className={cn('h-1 w-full', topBar)} />
            <CardHeader>
              <Badge className={cn('w-fit border-0 text-white hover:opacity-90', badgeClass)}>
                {statusText}
              </Badge>
              <CardTitle className="mt-2 text-lg leading-snug">{job.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 shrink-0 text-bv-primary" />
                  <span>{job.departmentName ?? `Department #${job.departmentId}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-bv-secondary" />
                  <span>{job.location || 'Toàn quốc'}</span>
                </div>
                {salaryText && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{salaryText}</span>
                  </div>
                )}
              </div>
              <div className="mt-5 space-y-2">
                <Button
                  className="w-full gap-2 transition-colors hover:bg-bv-primary hover:text-white hover:border-bv-primary"
                  variant="outline"
                  onClick={() => onApply?.(job)}
                >
                  Ứng tuyển
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  className="w-full gap-2"
                  variant="secondary"
                  onClick={() => handleAskAi(job)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Hỏi AI
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function JobsSection({ mode = 'locations', onApply }) {
  const [searchParams] = useSearchParams();
  const locationFilter = useMemo(() => {
    const raw = searchParams.get('location');
    return raw && raw.trim() ? raw.trim() : null;
  }, [searchParams]);

  const { data, isLoading, isError } = useAllPostedJobs();

  const allJobs = Array.isArray(data) ? data : [];
  const filteredJobs = useMemo(() => {
    if (mode !== 'jobs' || !locationFilter) return allJobs;
    return allJobs.filter((job) => {
      const jobLoc = (job.location || 'Toàn quốc').trim() || 'Toàn quốc';
      return jobLoc === locationFilter;
    });
  }, [allJobs, mode, locationFilter]);

  if (mode === 'locations') {
    return (
      <section id="jobs" className="bg-background py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle
            eyebrow="Cơ hội nghề nghiệp"
            title="Vị trí tuyển dụng nổi bật"
            subtitle="Khám phá các vị trí hấp dẫn đang mở tuyển tại BVBank trên toàn quốc."
          />
          <LocationsGrid jobs={allJobs} isLoading={isLoading} isError={isError} />
        </div>
      </section>
    );
  }

  return (
    <section id="jobs" className="bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          eyebrow="Cơ hội nghề nghiệp"
          title={
            locationFilter
              ? `Vị trí tại ${locationFilter}`
              : 'Vị trí tuyển dụng đang mở'
          }
          subtitle={
            locationFilter
              ? `Danh sách các vị trí đang tuyển tại ${locationFilter}.`
              : 'Khám phá tất cả vị trí đang mở tuyển tại BVBank trên toàn quốc.'
          }
        />

        <JobsGrid jobs={filteredJobs} isLoading={isLoading} isError={isError} onApply={onApply} />
      </div>
    </section>
  );
}
