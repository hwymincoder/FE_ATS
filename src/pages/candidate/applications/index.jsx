import { useEffect, useState } from 'react';
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  History,
  MapPin,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { extractErrorMessage } from '@/lib/extract-error';
import { cn } from '@/lib/utils';
import {
  useCandidateApplicationDetail,
  useCandidateApplications,
} from '@/pages/candidate/applications/hooks/useCandidateApplications';
import {
  downloadCandidateCv,
  viewCandidateCv,
} from '@/pages/candidate/chatbot/services/candidate-cv-service';

const dateTime = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
});

const stageThemes = {
  APPLIED: 'border-blue-200 bg-blue-50 text-blue-700',
  INTERVIEW: 'border-violet-200 bg-violet-50 text-violet-700',
  OFFER: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  REJECTED: 'border-rose-200 bg-rose-50 text-rose-700',
};

const stageLabels = {
  APPLIED: 'Đã ứng tuyển', INTERVIEW: 'Phỏng vấn', OFFER: 'Đề nghị nhận việc', REJECTED: 'Không phù hợp',
};

function stageKey(stage) {
  return stage?.name?.trim().toUpperCase() || 'UNKNOWN';
}

function StageBadge({ stage }) {
  const key = stageKey(stage);
  return (
    <Badge variant="outline" className={cn('whitespace-nowrap', stageThemes[key] || 'bg-slate-50 text-slate-700')}>
      {stageLabels[key] || stage?.name || 'Chưa xác định'}
    </Badge>
  );
}

function formatDate(value) {
  return value ? dateTime.format(new Date(value)) : 'Chưa cập nhật';
}

function CvActions({ cv }) {
  if (!cv?.id) return <span className="text-sm text-muted-foreground">Không có CV</span>;

  const view = async () => {
    try { await viewCandidateCv(cv.id, cv.fileName, cv.fileType); }
    catch (error) { toast.error(extractErrorMessage(error, 'Không thể mở CV')); }
  };
  const download = async () => {
    try { await downloadCandidateCv(cv.id, cv.fileName || `cv-${cv.id}`); }
    catch (error) { toast.error(extractErrorMessage(error, 'Không thể tải CV')); }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="min-w-0 basis-full break-words text-sm font-medium leading-5 sm:basis-48">
        {cv.fileName || `CV #${cv.id}`}
      </span>
      <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={view}>
        <Eye className="h-3.5 w-3.5" /> Xem CV
      </Button>
      <Button type="button" size="sm" variant="outline" className="gap-1.5" onClick={download}>
        <Download className="h-3.5 w-3.5" /> Tải CV
      </Button>
    </div>
  );
}

function DetailDialog({ applicationId, onClose }) {
  const { data, isLoading, error } = useCandidateApplicationDetail(applicationId);

  return (
    <Dialog open={Boolean(applicationId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{data?.job?.title || 'Chi tiết hồ sơ ứng tuyển'}</DialogTitle>
          <DialogDescription>Theo dõi giai đoạn, CV và lịch phỏng vấn của hồ sơ.</DialogDescription>
        </DialogHeader>

        {isLoading && <div className="h-40 animate-pulse rounded-xl bg-muted" />}
        {error && <div className="rounded-xl bg-destructive/10 p-4 text-sm text-destructive">Không thể tải chi tiết hồ sơ.</div>}
        {data && (
          <div className="space-y-5">
            <div className="grid gap-3 rounded-xl border bg-slate-50 p-4 sm:grid-cols-2">
              <div><div className="text-xs text-muted-foreground">Giai đoạn hiện tại</div><div className="mt-1"><StageBadge stage={data.currentStage} /></div></div>
              <div><div className="text-xs text-muted-foreground">Ngày ứng tuyển</div><div className="mt-1 text-sm font-medium">{formatDate(data.appliedAt)}</div></div>
              <div className="sm:col-span-2"><div className="mb-2 text-xs text-muted-foreground">CV đã sử dụng</div><CvActions cv={data.cv} /></div>
            </div>

            <section>
              <h3 className="mb-3 flex items-center gap-2 font-semibold"><History className="h-4 w-4 text-primary" />Lịch sử giai đoạn</h3>
              <div className="space-y-0">
                {(data.stageHistory || []).map((item, index) => (
                  <div key={item.id} className="relative flex gap-3 pb-5">
                    {index < data.stageHistory.length - 1 && <span className="absolute left-[9px] top-5 h-full w-px bg-border" />}
                    <CheckCircle2 className="relative z-10 mt-0.5 h-5 w-5 shrink-0 bg-background text-primary" />
                    <div className="min-w-0">
                      <StageBadge stage={item.toStage} />
                      <div className="mt-1 text-xs text-muted-foreground">{formatDate(item.movedAt)}</div>
                      {item.notes && <p className="mt-1 text-sm text-slate-600">{item.notes}</p>}
                    </div>
                  </div>
                ))}
                {!data.stageHistory?.length && <p className="text-sm text-muted-foreground">Chưa có lịch sử chuyển giai đoạn.</p>}
              </div>
            </section>

            {data.interview && (
              <section className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                <h3 className="flex items-center gap-2 font-semibold text-violet-900"><CalendarDays className="h-4 w-4" />Lịch phỏng vấn</h3>
                <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                  <div>Thời gian: <strong>{formatDate(data.interview.scheduledAt)}</strong></div>
                  <div>Thời lượng: <strong>{data.interview.durationMinutes || 0} phút</strong></div>
                  <div>Trạng thái: <strong>{data.interview.status || 'Chưa xác định'}</strong></div>
                  {data.interview.meetingLink && <a className="font-medium text-primary underline" href={data.interview.meetingLink} target="_blank" rel="noreferrer">Mở phòng phỏng vấn</a>}
                </div>
              </section>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function CandidateApplicationsPage() {
  const [page, setPage] = useState(1);
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [stage, setStage] = useState('ALL');
  const [selectedId, setSelectedId] = useState(null);
  const { data, isLoading, error } = useCandidateApplications({ page, size: 8, keyword: keyword || undefined, stage: stage === 'ALL' ? undefined : stage });

  useEffect(() => { setPage(1); }, [keyword, stage]);
  const items = data?.items ?? [];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gradient-to-b from-sky-50 via-white to-slate-50">
      <section className="border-b bg-gradient-to-r from-blue-950 via-blue-700 to-sky-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-9 lg:px-10">
          <Badge className="mb-3 border-white/20 bg-white/10 text-white hover:bg-white/10"><History className="mr-1 h-3.5 w-3.5" />Hành trình ứng tuyển</Badge>
          <h1 className="text-3xl font-bold">Lịch sử ứng tuyển</h1>
          <p className="mt-2 text-sm text-blue-100">Theo dõi tiến độ từng hồ sơ và xem lại CV bạn đã sử dụng.</p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-6 py-7 lg:px-10">
        <div className="mb-6 grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto]">
          <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={keywordInput} onChange={(e) => setKeywordInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setKeyword(keywordInput.trim())} placeholder="Tìm theo tên công việc..." /></div>
          <Select value={stage} onValueChange={setStage}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ALL">Tất cả giai đoạn</SelectItem><SelectItem value="Applied">Đã ứng tuyển</SelectItem><SelectItem value="Interview">Phỏng vấn</SelectItem><SelectItem value="Offer">Đề nghị nhận việc</SelectItem><SelectItem value="Rejected">Không phù hợp</SelectItem></SelectContent></Select>
          <Button onClick={() => setKeyword(keywordInput.trim())}>Tìm kiếm</Button>
        </div>

        {isLoading && <div className="grid gap-4 md:grid-cols-2">{[1,2,3,4].map((n) => <div key={n} className="h-52 animate-pulse rounded-2xl bg-muted" />)}</div>}
        {error && <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center text-destructive">Không thể tải lịch sử ứng tuyển.</div>}
        {!isLoading && !error && !items.length && <div className="rounded-2xl border bg-white p-16 text-center shadow-sm"><BriefcaseBusiness className="mx-auto h-12 w-12 text-muted-foreground" /><h2 className="mt-4 text-lg font-semibold">Chưa có hồ sơ phù hợp</h2><p className="mt-1 text-sm text-muted-foreground">Hãy ứng tuyển công việc hoặc thay đổi bộ lọc tìm kiếm.</p></div>}

        <div className="grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.applicationId} className="overflow-hidden rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="h-1.5 bg-gradient-to-r from-blue-700 to-sky-400" />
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h2 className="truncate text-lg font-bold">{item.job?.title}</h2><div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{item.job?.location || 'Chưa cập nhật'}</div></div><StageBadge stage={item.currentStage} /></div>
                <div className="grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm"><div><span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />Ứng tuyển</span><strong className="mt-1 block">{formatDate(item.appliedAt)}</strong></div><div className="min-w-0"><span className="flex items-center gap-1 text-xs text-muted-foreground"><FileText className="h-3.5 w-3.5" />CV đã dùng</span><strong className="mt-1 line-clamp-2 break-words leading-5">{item.cv?.fileName || 'Không có CV'}</strong></div></div>
                <div className="flex flex-wrap justify-between gap-2"><CvActions cv={item.cv} /><Button onClick={() => setSelectedId(item.applicationId)}>Xem chi tiết</Button></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {data?.totalPages > 1 && <div className="mt-7 flex items-center justify-center gap-3"><Button variant="outline" disabled={!data.hasPrevious} onClick={() => setPage((p) => p - 1)}>Trang trước</Button><span className="text-sm text-muted-foreground">Trang {data.page + 1}/{data.totalPages}</span><Button variant="outline" disabled={!data.hasNext} onClick={() => setPage((p) => p + 1)}>Trang sau</Button></div>}
      </main>

      <DetailDialog applicationId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
