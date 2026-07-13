import { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Info,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const DAY_LABELS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

const pad = (value) => String(value).padStart(2, '0');

const toValidDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getStartTime = (item) => item?.scheduledAt || item?.startTime;

const getEndTime = (item) => {
  if (item?.endTime) return item.endTime;
  const start = toValidDate(getStartTime(item));
  if (!start) return null;
  start.setMinutes(start.getMinutes() + Number(item?.durationMinutes ?? 0));
  return start.toISOString();
};

const formatDate = (date) => {
  if (!date) return '-';
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
};

const formatTime = (value) => {
  const date = toValidDate(value);
  if (!date) return '-';
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDateTime = (value) => {
  const date = toValidDate(value);
  if (!date) return '-';
  return `${formatDate(date)} ${formatTime(date)}`;
};

const getWeekInputValue = (date) => {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));

  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const week =
    1 +
    Math.round(
      ((target - firstThursday) / 86400000 - 3 + ((firstThursday.getDay() + 6) % 7)) / 7,
    );

  return `${target.getFullYear()}-W${pad(week)}`;
};

const parseWeekInputValue = (value) => {
  const match = value.match(/^(\d{4})-W(\d{2})$/);
  if (!match) return null;

  const year = Number(match[1]);
  const week = Number(match[2]);
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const day = simple.getDay();
  const weekStart = new Date(simple);

  if (day === 0) {
    weekStart.setDate(simple.getDate() - 6);
  } else if (day <= 4) {
    weekStart.setDate(simple.getDate() - day + 1);
  } else {
    weekStart.setDate(simple.getDate() + 8 - day);
  }

  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

const isSameDay = (left, right) =>
  left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() &&
  left.getDate() === right.getDate();

const buildWeekDays = (weekStart) =>
  DAY_LABELS.map((label, index) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + index);
    return { label, date };
  });

const normalizeMeetingHref = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  return value.startsWith('/') ? value : `/${value}`;
};

const INTERVIEW_RESULT_OPTIONS = [
  { value: 'PENDING', label: 'Chờ kết quả' },
  { value: 'PASS', label: 'Đạt' },
  { value: 'FAIL', label: 'Trượt' },
  { value: 'CONSIDER', label: 'Cân nhắc' },
];

const getResultLabel = (result) => {
  if (result === 'PENDING') return 'Chờ kết quả';
  if (result === 'PASS') return 'Đạt';
  if (result === 'FAIL') return 'Trượt';
  if (result === 'CONSIDER') return 'Cân nhắc';
  return 'Chờ kết quả';
};

const getInterviewCardClass = (result) => {
  if (result === 'PASS') return 'border-green-300 bg-green-50 hover:bg-green-100';
  if (result === 'FAIL') return 'border-red-300 bg-red-50 hover:bg-red-100';
  if (result === 'CONSIDER') return 'border-yellow-300 bg-yellow-50 hover:bg-yellow-100';
  return 'border-primary/15 bg-accent/40 hover:bg-accent';
};

const getInterviewTitleClass = (result) => {
  if (result === 'PASS') return 'border-green-600 text-green-900';
  if (result === 'FAIL') return 'border-red-600 text-red-900';
  if (result === 'CONSIDER') return 'border-yellow-500 text-yellow-900';
  return 'border-primary text-accent-foreground';
};

const getInterviewIconClass = (result) => {
  if (result === 'PASS') return 'text-green-700';
  if (result === 'FAIL') return 'text-red-700';
  if (result === 'CONSIDER') return 'text-yellow-700';
  return 'text-primary';
};

const getResultPillClass = (result) => {
  if (result === 'PASS') return 'border-green-300 bg-green-100 text-green-800';
  if (result === 'FAIL') return 'border-red-300 bg-red-100 text-red-800';
  if (result === 'CONSIDER') return 'border-yellow-300 bg-yellow-100 text-yellow-800';
  return 'border-border bg-background text-foreground';
};

const getStatusLabel = (status) => {
  if (status === 'COMPLETED') return 'Đã hoàn thành';
  if (status === 'CANCELLED') return 'Đã hủy';
  if (status === 'SCHEDULED') return 'Đã lên lịch';
  return status || '-';
};

const getStatusBadgeVariant = (status) => {
  if (status === 'COMPLETED') return 'secondary';
  if (status === 'CANCELLED') return 'destructive';
  return 'outline';
};

const Field = ({ label, value, children }) => (
  <div className="space-y-1">
    <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className="text-sm text-foreground">{children || value || '-'}</div>
  </div>
);

const InterviewDetailDialog = ({
  open,
  onOpenChange,
  interview,
  onUpdateResult,
  updatingResult,
}) => {
  const startTime = getStartTime(interview);
  const endTime = getEndTime(interview);
  const meetingHref = normalizeMeetingHref(interview?.meetingLink);
  const [result, setResult] = useState(interview?.result || 'PENDING');
  const [feedback, setFeedback] = useState(interview?.feedback || '');

  useEffect(() => {
    setResult(interview?.result || 'PENDING');
    setFeedback(interview?.feedback || '');
  }, [interview]);

  const handleUpdateResult = () => {
    if (!interview?.id) return;
    onUpdateResult({
      id: interview.id,
      payload: {
        result,
        feedback,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-primary/15 bg-card text-card-foreground">
        <DialogHeader className="border-b border-border pb-3">
          <DialogTitle>Chi tiết phỏng vấn</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <section className="space-y-3 rounded-md border border-primary/10 bg-secondary/40 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold">{interview?.jobTitle || '-'}</h3>
              <Badge variant={getStatusBadgeVariant(interview?.status)}>
                {getStatusLabel(interview?.status)}
              </Badge>
              <span
                className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold ${getResultPillClass(interview?.result)}`}
              >
                {getResultLabel(interview?.result)}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Mã phỏng vấn" value={interview?.id} />
              <Field label="Mã application" value={interview?.applicationId} />
              <Field label="Người phỏng vấn" value={interview?.interviewerName} />
              <Field label="Thời lượng" value={`${interview?.durationMinutes ?? '-'} phút`} />
              <Field label="Thời gian">
                {formatDateTime(startTime)} - {formatTime(endTime)}
              </Field>
              <Field label="Meeting link">
                {interview?.meetingLink ? (
                  <a
                    href={meetingHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
                  >
                    Meet
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  '-'
                )}
              </Field>
            </div>
          </section>

          <section className="space-y-3 rounded-md border bg-card p-4">
            <h3 className="text-base font-semibold">Thông tin ứng viên</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Mã ứng viên" value={interview?.candidateId || interview?.candidate?.id} />
              <Field label="Họ tên" value={interview?.candidateName} />
              <Field label="Email" value={interview?.candidateEmail} />
              <Field label="Số điện thoại" value={interview?.candidatePhone} />
            </div>
          </section>

          <section className="space-y-3 rounded-md border bg-card p-4">
            <h3 className="text-base font-semibold">CV</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Mã CV" value={interview?.cv?.id} />
              <Field label="Loại file" value={interview?.cv?.fileType} />
              <Field label="Tên file" value={interview?.cv?.fileName || '-'} />
              <Field label="Trạng thái parse" value={interview?.cv?.hasParsedText ? 'Đã parse' : 'Chưa parse'} />
              <Field label="Đường dẫn CV">
                {interview?.cv?.filePath ? (
                  <a
                    href={normalizeMeetingHref(interview.cv.filePath)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 break-all text-primary underline-offset-4 hover:underline"
                  >
                    {interview.cv.filePath}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  '-'
                )}
              </Field>
              <Field label="Ngày tạo CV" value={formatDateTime(interview?.cv?.createdAt)} />
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-semibold">Feedback</h3>
            <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground">
              {interview?.feedback || 'Chưa có feedback.'}
            </div>
          </section>

          <section className="space-y-3 rounded-md border border-primary/10 bg-secondary/40 p-4">
            <h3 className="text-base font-semibold">Cập nhật kết quả</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground" htmlFor="interview-result">
                  Trạng thái
                </label>
                <select
                  id="interview-result"
                  value={result}
                  onChange={(event) => setResult(event.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  {INTERVIEW_RESULT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground" htmlFor="interview-feedback">
                  Feedback
                </label>
                <textarea
                  id="interview-feedback"
                  value={feedback}
                  onChange={(event) => setFeedback(event.target.value)}
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Nhập feedback cho buổi phỏng vấn"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="button" onClick={handleUpdateResult} disabled={updatingResult}>
                {updatingResult ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const InterviewsDataTable = ({
  data = [],
  isLoading,
  weekStart,
  weekEnd,
  onWeekChange,
  onWeekSelect,
  onResetWeek,
  onViewDetail,
  onUpdateResult,
  updatingResult,
  selectedInterview,
  detailOpen,
  onDetailOpenChange,
  totalItems,
}) => {
  const weekDays = useMemo(() => buildWeekDays(weekStart), [weekStart]);
  const weekInputValue = useMemo(() => getWeekInputValue(weekStart), [weekStart]);

  const weeklyItems = useMemo(() => {
    return data
      .map((item) => ({ ...item, scheduledDate: toValidDate(getStartTime(item)) }))
      .filter((item) => item.scheduledDate && item.scheduledDate >= weekStart && item.scheduledDate <= weekEnd)
      .sort((a, b) => a.scheduledDate - b.scheduledDate);
  }, [data, weekEnd, weekStart]);

  const itemsByDay = useMemo(() => {
    return weekDays.map((day) => ({
      ...day,
      items: weeklyItems.filter((item) => isSameDay(item.scheduledDate, day.date)),
    }));
  }, [weekDays, weeklyItems]);

  const handleWeekInputChange = (event) => {
    const nextWeekStart = parseWeekInputValue(event.target.value);
    if (nextWeekStart) {
      onWeekSelect(nextWeekStart);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-primary/10 bg-secondary/60 p-3 text-secondary-foreground lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase text-muted-foreground">
              Khoảng thời gian
            </div>
            <div className="font-semibold">
              Từ ngày {formatDate(weekStart)} đến ngày {formatDate(weekEnd)}
            </div>
            {/*<div className="text-sm text-muted-foreground">*/}
            {/*  {weeklyItems.length} lịch trong tuần này, {totalItems ?? data.length} lịch trong trang API hiện tại*/}
            {/*</div>*/}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-sm font-medium text-secondary-foreground">
            Chọn tuần
            <input
              type="week"
              value={weekInputValue}
              onChange={handleWeekInputChange}
              className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
          <Button type="button" variant="outline" size="sm" onClick={() => onWeekChange(-1)}>
            <ChevronLeft className="h-4 w-4" />
            Tuần trước
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onResetWeek}>
            Tuần này
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => onWeekChange(1)}>
            Tuần sau
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-md border border-primary/10 bg-card shadow-sm">
        <Table className="table-fixed min-w-[980px] xl:min-w-0">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {itemsByDay.map((day) => (
                <TableHead key={day.label} className="h-11 border-r-2 border-primary-foreground/40 bg-primary px-2 py-2 text-primary-foreground last:border-r-0">
                  <div className="space-y-0.5">
                    <div className="font-semibold">{day.label}</div>
                    <div className="text-xs text-primary-foreground/80">{formatDate(day.date)}</div>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              {itemsByDay.map((day) => (
                <TableCell key={day.label} className="h-[calc(100vh-330px)] min-h-[320px] border-r-2 border-primary/15 bg-card p-2 align-top last:border-r-0">
                  {isLoading ? (
                    <div className="text-sm text-muted-foreground">Đang tải...</div>
                  ) : day.items.length ? (
                    <div className="space-y-2">
                      {day.items.map((item) => {
                        const meetingHref = normalizeMeetingHref(item.meetingLink);
                        return (
                          <div
                            key={item.id}
                            className={`rounded-md border p-2 shadow-sm transition-colors ${getInterviewCardClass(item.result)}`}
                          >
                            <div
                              className={`line-clamp-2 border-l-2 pl-2 text-xs font-semibold leading-5 ${getInterviewTitleClass(item.result)}`}
                            >
                              {item.jobTitle || item.position || '-'}
                            </div>
                            {item.result && item.result !== 'PENDING' ? (
                              <div className="mt-1.5">
                                <span
                                  className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getResultPillClass(item.result)}`}
                                >
                                  {getResultLabel(item.result)}
                                </span>
                              </div>
                            ) : null}
                            <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className={`h-3.5 w-3.5 ${getInterviewIconClass(item.result)}`} />
                              {formatTime(getStartTime(item))} - {formatTime(getEndTime(item))}
                            </div>
                            <div className="mt-1.5 text-xs">
                              {item.meetingLink ? (
                                <a
                                  href={meetingHref}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex max-w-full items-center gap-1 truncate font-medium text-primary underline-offset-4 hover:underline"
                                >
                                  <span className="truncate">Meet</span>
                                  <ExternalLink className="h-3.5 w-3.5 flex-none" />
                                </a>
                              ) : (
                                <span className="text-muted-foreground">Chưa có meeting link</span>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2 h-8 w-full px-2 text-xs"
                              onClick={() => onViewDetail(item)}
                            >
                              <Info className="h-4 w-4" />
                              Chi tiết
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex h-full min-h-[180px] items-center justify-center rounded-md border border-dashed bg-muted/60 text-center text-sm text-muted-foreground">
                      Không có lịch
                    </div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <InterviewDetailDialog
        open={detailOpen}
        onOpenChange={onDetailOpenChange}
        interview={selectedInterview}
        onUpdateResult={onUpdateResult}
        updatingResult={updatingResult}
      />
    </div>
  );
};

export default InterviewsDataTable;
