import { Briefcase, CheckCircle2, ClipboardList, XCircle } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';

const STATS = [
  { key: 'total', label: 'Tổng job', value: 0, icon: Briefcase },
  { key: 'draft', label: 'Job nháp', value: 0, icon: ClipboardList },
  { key: 'published', label: 'Job đã đăng', value: 0, icon: CheckCircle2 },
  { key: 'closed', label: 'Job đã đóng', value: 0, icon: XCircle },
];

export default function RecruiterDashboard() {
  return (
    <div>
      <PageHeader
        title="Recruiter Dashboard"
        description="Tổng quan về hoạt động tuyển dụng của bạn"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.key}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
