import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Plus,
  UsersRound,
  XCircle,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JOB_STATUS } from '@/pages/recruiter/jobs/constants';
import { useRecruiterJobList } from '@/pages/recruiter/jobs/hooks/useRecruiterJobQueries';

const STATUS_META = {
  [JOB_STATUS.DRAFT]: {
    label: 'Nháp',
    icon: ClipboardList,
    badge: 'secondary',
  },
  [JOB_STATUS.PUBLISHED]: {
    label: 'Đã đăng',
    icon: CheckCircle2,
    badge: 'default',
  },
  [JOB_STATUS.CLOSED]: {
    label: 'Đã đóng',
    icon: XCircle,
    badge: 'outline',
  },
};

function toNumber(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

function formatDate(value) {
  if (!value) return 'Chưa có hạn';
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function getStatusMeta(status) {
  return STATUS_META[status] ?? {
    label: status || 'Không rõ',
    icon: Clock3,
    badge: 'secondary',
    bar: 'bg-muted-foreground',
  };
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-3">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <div className="text-lg font-semibold">{value.toLocaleString('vi-VN')}</div>
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

export default function RecruiterDashboard() {
  const { data, isLoading, isFetching } = useRecruiterJobList({
    page: 1,
    size: 100,
  });

  const jobs = data?.data ?? [];
  const totalJobs = data?.total ?? jobs.length;
  const isBusy = isLoading || isFetching;

  const dashboard = useMemo(() => {
    const counts = {
      [JOB_STATUS.DRAFT]: 0,
      [JOB_STATUS.PUBLISHED]: 0,
      [JOB_STATUS.CLOSED]: 0,
    };

    let totalApplications = 0;
    for (const job of jobs) {
      if (counts[job.status] != null) {
        counts[job.status] += 1;
      }
      totalApplications += toNumber(job.applicationCount);
    }

    const topJobs = [...jobs]
      .sort((a, b) => toNumber(b.applicationCount) - toNumber(a.applicationCount))
      .slice(0, 5);

    const closingSoon = jobs
      .filter((job) => job.status === JOB_STATUS.PUBLISHED && job.deadline)
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 4);

    return {
      counts,
      totalApplications,
      topJobs,
      closingSoon,
    };
  }, [jobs]);

  const statCards = [
    {
      key: 'total',
      label: 'Tổng job',
      value: totalJobs,
      icon: Briefcase,
      description: 'Tất cả tin tuyển dụng của bạn',
    },
    {
      key: 'published',
      label: 'Job đã đăng',
      value: dashboard.counts[JOB_STATUS.PUBLISHED],
      icon: CheckCircle2,
      description: 'Đang hiển thị cho ứng viên',
    },
    {
      key: 'draft',
      label: 'Job nháp',
      value: dashboard.counts[JOB_STATUS.DRAFT],
      icon: ClipboardList,
      description: 'Cần hoàn thiện trước khi đăng',
    },
    {
      key: 'applications',
      label: 'Tổng ứng viên',
      value: dashboard.totalApplications,
      icon: UsersRound,
      description: 'Tổng application trên các job tải về',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <PageHeader
          title="Recruiter Dashboard"
          description="Theo dõi hiệu quả tin tuyển dụng và các job cần ưu tiên"
        />
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/application">
              Applications
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/recruiter/jobs">
              <Plus className="h-4 w-4" />
              Quản lý job
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.key} {...stat} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle style={{ color: '#d97706', fontWeight: 700 }}>
            Sắp hết hạn
          </CardTitle>
          <p className="text-sm text-muted-foreground">Job đã đăng có deadline gần nhất</p>
        </CardHeader>
        <CardContent>
          {dashboard.closingSoon.length ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {dashboard.closingSoon.map((job) => (
                <div key={job.id} className="flex items-center justify-between gap-3 rounded-md border p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{job.title}</div>
                    <div className="text-xs text-muted-foreground">{job.location || 'Chưa có địa điểm'}</div>
                  </div>
                  <Badge variant="outline">{formatDate(job.deadline)}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Không có job đã đăng nào sắp hết hạn.
            </div>
          )}
        </CardContent>
      </Card>

      <div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Top job nhiều ứng viên</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                5 job đang nhận được nhiều application nhất
              </p>
            </div>
            <Badge variant="secondary">{dashboard.topJobs.length}/5</Badge>
          </CardHeader>
          <CardContent>
            {isBusy ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-16 animate-pulse rounded-md bg-muted" />
                ))}
              </div>
            ) : dashboard.topJobs.length ? (
              <div className="space-y-3">
                {dashboard.topJobs.map((job, index) => {
                  const count = toNumber(job.applicationCount);
                  const max = Math.max(toNumber(dashboard.topJobs[0]?.applicationCount), 1);
                  const width = Math.max((count / max) * 100, count > 0 ? 8 : 0);
                  const status = getStatusMeta(job.status);

                  return (
                    <div key={job.id} className="rounded-md border p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                              {index + 1}
                            </span>
                            <h3 className="truncate text-sm font-semibold">{job.title}</h3>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>{job.departmentName || job.department || 'Chưa có phòng ban'}</span>
                            <span>•</span>
                            <span>{job.location || 'Chưa có địa điểm'}</span>
                            <span>•</span>
                            <span>Hạn {formatDate(job.deadline)}</span>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-sm font-semibold">{count.toLocaleString('vi-VN')}</div>
                          <div className="text-xs text-muted-foreground">ứng viên</div>
                        </div>
                      </div>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <Badge variant={status.badge}>{status.label}</Badge>
                        <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
                          <Link to={`/application/${job.id}/kanban`}>Kanban</Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                Chưa có job nào để thống kê.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
