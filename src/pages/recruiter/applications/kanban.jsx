import { ArrowLeft, CalendarClock, FileText, Mail, Phone, UserRound } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PageHeader } from '@/components/shared/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { extractErrorMessage } from '@/lib/extract-error';
import { cn } from '@/lib/utils';
import { viewRecruiterCv, downloadRecruiterCv } from '@/pages/recruiter/applications/services/recruiter-cv-service';
import {
    APPLICATION_PRIORITY,
    getApplicationPriorityBadgeVariant,
    getApplicationPriorityDisplayLabel,
    getApplicationPriorityLabel,
} from '@/pages/recruiter/applications/constants';
import {
    useCreateRecruiterApplicationInterview,
    useMoveRecruiterApplicationStage,
    useUpdateRecruiterApplicationInterview,
} from '@/pages/recruiter/applications/hooks/useRecruiterApplicationMutations';
import { useRecruiterApplicationDetail } from '@/pages/recruiter/applications/hooks/useRecruiterApplicationQueries';
import {
    useRecruiterJobInterviewers,
    useRecruiterJobKanban,
} from '@/pages/recruiter/jobs/hooks/useRecruiterJobQueries';

const STAGE_TRANSITIONS = {
    APPLIED: ['INTERVIEW', 'REJECTED'],
    INTERVIEW: ['OFFER', 'REJECTED'],
};

const DEFAULT_SCHEDULE_FORM = {
    interviewId: null,
    interviewerId: '',
    scheduledAt: '',
    durationMinutes: '60',
    meetingLink: '',
    note: '',
};

function normalizeStageName(stageName) {
    return String(stageName ?? '').trim().toUpperCase();
}

function canMoveStage(fromStage, toStage) {
    const fromStageName = normalizeStageName(fromStage?.stageName);
    const toStageName = normalizeStageName(toStage?.stageName);

    if (!fromStageName || !toStageName || fromStageName === toStageName) return false;

    return STAGE_TRANSITIONS[fromStageName]?.includes(toStageName) ?? false;
}

function getStageOptions(stages, currentStage) {
    const currentStageName = normalizeStageName(currentStage?.stageName);
    const allowedStageNames = STAGE_TRANSITIONS[currentStageName] ?? [];

    return stages.filter((stage) => {
        const stageName = normalizeStageName(stage.stageName);
        return stage.stageId === currentStage.stageId || allowedStageNames.includes(stageName);
    });
}

function toDateTimeLocalValue(value) {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

function toIsoDateTime(value) {
    if (!value) return '';

    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString();
}

function formatDateTime(value) {
    if (!value) return 'Chưa có lịch';

    return new Date(value).toLocaleString('vi-VN', {
        dateStyle: 'short',
        timeStyle: 'short',
    });
}

function getInterviewBadgeVariant(result) {
    if (result === 'PASS') return 'default';
    if (result === 'FAIL') return 'destructive';

    return 'secondary';
}

function getStageMoveConfirmContent(toStage) {
    const toStageName = normalizeStageName(toStage?.stageName);

    if (toStageName === 'REJECTED') {
        return {
            title: 'Reject ứng viên',
            description: `Bạn có chắc chắn muốn chuyển ứng viên sang ${toStage.stageName}? Ứng viên sẽ bị loại khỏi quy trình hiện tại.`,
            confirmText: 'Reject',
            destructive: true,
        };
    }

    if (toStageName === 'OFFER') {
        return {
            title: 'Chuyển sang Offer',
            description: `Bạn có chắc chắn muốn chuyển ứng viên sang ${toStage.stageName}? Hãy đảm bảo kết quả phỏng vấn đã phù hợp trước khi tiếp tục.`,
            confirmText: 'Chuyển sang Offer',
            destructive: false,
        };
    }

    return {
        title: 'Chuyển stage',
        description: `Bạn có chắc chắn muốn chuyển ứng viên sang ${toStage?.stageName || 'stage này'}?`,
        confirmText: 'Chuyển stage',
        destructive: false,
    };
}

function DetailRow({ label, value }) {
    return (
        <div className="space-y-1">
            <div className="text-xs font-medium uppercase text-muted-foreground">{label}</div>
            <div className="break-words text-sm">{value || '—'}</div>
        </div>
    );
}

function ApplicationCard({
    application,
    currentStage,
    moving,
    onDragStart,
    onMoveStage,
    onOpenDetail,
    onOpenSchedule,
    onViewCv,
    stages,
}) {
    const stageOptions = getStageOptions(stages, currentStage);
    const isInterviewStage = normalizeStageName(currentStage.stageName) === 'INTERVIEW';
    const priorityLabel = getApplicationPriorityLabel(application.priority);
    const priorityVariant = getApplicationPriorityBadgeVariant(application.priority);
    const normalizedPriority = Number(application.priority ?? 0);

    return (
        <Card
            draggable={!moving}
            role="button"
            tabIndex={0}
            onClick={() => onOpenDetail(application.applicationId)}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    onOpenDetail(application.applicationId);
                }
            }}
            onDragStart={() => onDragStart(application.applicationId, currentStage)}
            onDragEnd={() => onDragStart(null, null)}
            className={cn(
                'rounded-md border bg-background shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                normalizedPriority >= APPLICATION_PRIORITY.PREMIUM && 'border-2 border-amber-500',
                normalizedPriority === APPLICATION_PRIORITY.PRO && 'border-2 border-sky-500',
                moving && 'cursor-wait opacity-60',
                !moving && 'cursor-grab active:cursor-grabbing',
            )}
        >
            <CardHeader className="space-y-3 p-5">
                <div className="flex items-start justify-between gap-3">
                    <CardTitle className="line-clamp-2 text-base leading-6">
                        {application.candidateName || 'Ứng viên chưa có tên'}
                    </CardTitle>
                    <div className="flex flex-wrap items-start justify-end gap-2">
                        {priorityLabel && (
                            <Badge variant={priorityVariant}>{priorityLabel}</Badge>
                        )}
                        {application.interviewResult && (
                            <Badge variant={getInterviewBadgeVariant(application.interviewResult)}>
                                {application.interviewResult}
                            </Badge>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserRound className="h-4 w-4" />
                    <span>#{application.applicationId}</span>
                </div>
            </CardHeader>

            <CardContent className="space-y-3 p-5 pt-0 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 shrink-0" />
                    <span className="truncate">{application.candidateEmail || 'Chưa có email'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span className="truncate">{application.candidatePhone || 'Chưa có số điện thoại'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 shrink-0" />
                    <span className="truncate">{formatDateTime(application.interviewScheduledAt)}</span>
                </div>
                {application.cvFilePath && (
                    <button
                        type="button"
                        onClick={(event) => {
                            event.stopPropagation();
                            onViewCv?.(application.applicationId, application.cvFileType);
                        }}
                        className="flex items-center gap-2 w-full text-left text-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
                    >
                        <FileText className="h-4 w-4 shrink-0" />
                        <span className="truncate">Xem CV {application.cvFileType ? `(${application.cvFileType})` : ''}</span>
                    </button>
                )}
                <select
                    value={currentStage.stageId}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => {
                        event.stopPropagation();
                        onMoveStage(application.applicationId, Number(event.target.value));
                    }}
                    disabled={moving}
                    className="mt-3 h-10 w-full rounded-md border bg-background px-3 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {stageOptions.map((stage) => (
                        <option key={stage.stageId} value={stage.stageId}>
                            {stage.stageName}
                        </option>
                    ))}
                </select>
                {isInterviewStage && (
                    <Button
                        type="button"
                        variant="outline"
                        className="mt-2 w-full"
                        onClick={(event) => {
                            event.stopPropagation();
                            if (application.interviewId) {
                                onOpenDetail(application.applicationId);
                                return;
                            }
                            onOpenSchedule(application);
                        }}
                        disabled={moving}
                    >
                        {application.interviewId ? 'Xem / sửa lịch' : 'Lên lịch hẹn'}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}

function KanbanColumn({
    stage,
    draggingApplication,
    movingApplicationId,
    onDropApplication,
    onDragStart,
    onOpenDetail,
    onMoveStage,
    onOpenSchedule,
    onViewCv,
    stages,
}) {
    const applications = stage.applications ?? [];
    const isDragging = Boolean(draggingApplication);
    const isCurrentDragStage = draggingApplication?.fromStageId === stage.stageId;
    const isValidDropTarget = isDragging && canMoveStage(draggingApplication.fromStage, stage);
    const isInvalidDropTarget = isDragging && !isCurrentDragStage && !isValidDropTarget;

    return (
        <section
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDropApplication(stage.stageId)}
            className={cn(
                'flex min-h-[34rem] min-w-0 flex-col rounded-lg border bg-muted/25 shadow-sm transition-colors',
                isValidDropTarget && 'border-primary/60 bg-primary/10 ring-1 ring-primary/20',
                isInvalidDropTarget && 'opacity-60',
            )}
        >
            <div className="flex items-center justify-between gap-3 border-b bg-background/70 px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold">{stage.stageName}</h2>
                    <p className="text-sm text-muted-foreground">Stage #{stage.stageId}</p>
                </div>
                <Badge variant="secondary">{stage.totalApplications ?? applications.length}</Badge>
            </div>

            <div className="flex-1 space-y-4 p-4">
                {applications.length ? (
                    applications.map((application) => (
                        <ApplicationCard
                            key={application.applicationId}
                            application={application}
                            currentStage={stage}
                            moving={
                                movingApplicationId === application.applicationId ||
                                draggingApplication?.applicationId === application.applicationId
                            }
                            onDragStart={onDragStart}
                            onOpenDetail={onOpenDetail}
                            onMoveStage={onMoveStage}
                            onOpenSchedule={onOpenSchedule}
                            onViewCv={onViewCv}
                            stages={stages}
                        />
                    ))
                ) : (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed bg-background text-sm text-muted-foreground">
                        Chưa có ứng viên
                    </div>
                )}
            </div>
        </section>
    );
}

export default function RecruiterApplicationKanbanPage() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { data, isLoading, isFetching, isError, error } = useRecruiterJobKanban(jobId);
    const {
        data: interviewers = [],
        isLoading: isLoadingInterviewers,
        isError: isInterviewersError,
    } = useRecruiterJobInterviewers(jobId);
    const moveStageMutation = useMoveRecruiterApplicationStage();
    const createInterviewMutation = useCreateRecruiterApplicationInterview({
        onSuccess: () => {
            setSchedulingApplication(null);
            setScheduleForm(DEFAULT_SCHEDULE_FORM);
        },
    });
    const updateInterviewMutation = useUpdateRecruiterApplicationInterview({
        onSuccess: () => {
            setSchedulingApplication(null);
            setScheduleForm(DEFAULT_SCHEDULE_FORM);
        },
    });
    const [draggingApplication, setDraggingApplication] = useState(null);
    const [detailApplicationId, setDetailApplicationId] = useState(null);
    const [pendingStageMove, setPendingStageMove] = useState(null);
    const [schedulingApplication, setSchedulingApplication] = useState(null);
    const [scheduleForm, setScheduleForm] = useState(DEFAULT_SCHEDULE_FORM);
    const {
        data: applicationDetail,
        isLoading: isLoadingApplicationDetail,
        isError: isApplicationDetailError,
        error: applicationDetailError,
    } = useRecruiterApplicationDetail(detailApplicationId);

    const stages = [...(data?.stages ?? [])].sort(
        (a, b) => (a.stageOrder ?? 0) - (b.stageOrder ?? 0),
    );
    const movingApplicationId = moveStageMutation.isPending
        ? moveStageMutation.variables?.applicationId
        : null;

    const handleMoveStage = (applicationId, toStageId, fromStageId) => {
        if (!applicationId || !toStageId || Number(toStageId) === Number(fromStageId)) return;

        const fromStage = stages.find((stage) => Number(stage.stageId) === Number(fromStageId));
        const toStage = stages.find((stage) => Number(stage.stageId) === Number(toStageId));

        if (!canMoveStage(fromStage, toStage)) {
            toast.warning('Không thể chuyển ứng viên sang stage này');
            return;
        }

        setPendingStageMove({
            applicationId,
            jobId,
            toStageId,
            fromStage,
            toStage,
        });
    };

    const handleConfirmStageMove = () => {
        if (!pendingStageMove) return;

        moveStageMutation.mutate({
            applicationId: pendingStageMove.applicationId,
            jobId: pendingStageMove.jobId,
            toStageId: pendingStageMove.toStageId,
        });
        setPendingStageMove(null);
    };

    const handleDragStart = (applicationId, fromStage) => {
        setDraggingApplication(
            applicationId ? { applicationId, fromStageId: fromStage.stageId, fromStage } : null,
        );
    };

    const handleDropApplication = (toStageId) => {
        if (!draggingApplication) return;

        handleMoveStage(
            draggingApplication.applicationId,
            toStageId,
            draggingApplication.fromStageId,
        );
        setDraggingApplication(null);
    };

    const handleOpenSchedule = (application) => {
        setSchedulingApplication(application);
        setScheduleForm({
            interviewId: application.interviewId ?? null,
            interviewerId: application.interviewerId ? String(application.interviewerId) : '',
            scheduledAt: toDateTimeLocalValue(application.interviewScheduledAt),
            durationMinutes: '60',
            meetingLink: '',
            note: '',
        });
    };

    const handleOpenEditSchedule = () => {
        if (!applicationDetail?.interview) return;

        setSchedulingApplication({
            applicationId: applicationDetail.applicationId,
            candidateName: applicationDetail.candidate?.name,
        });
        setScheduleForm({
            interviewId: applicationDetail.interview.id,
            interviewerId: applicationDetail.interview.interviewerId
                ? String(applicationDetail.interview.interviewerId)
                : '',
            scheduledAt: toDateTimeLocalValue(applicationDetail.interview.scheduledAt),
            durationMinutes: applicationDetail.interview.durationMinutes
                ? String(applicationDetail.interview.durationMinutes)
                : '60',
            meetingLink: applicationDetail.interview.meetingLink || '',
            note: '',
        });
    };

    const handleViewCv = async (applicationId, fileType) => {
        try {
            await viewRecruiterCv(applicationId, null, fileType);
        } catch {
            toast.error('Không thể mở file CV. Vui lòng thử lại.');
        }
    };

    const handleScheduleFieldChange = (field, value) => {
        setScheduleForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmitSchedule = (event) => {
        event.preventDefault();
        if (!schedulingApplication) return;

        const interviewerId = Number(scheduleForm.interviewerId);
        const durationMinutes = Number(scheduleForm.durationMinutes);
        const scheduledAt = toIsoDateTime(scheduleForm.scheduledAt);

        if (!interviewerId || !scheduledAt || !durationMinutes) {
            toast.warning('Vui lòng nhập đủ interviewer, thời gian và thời lượng');
            return;
        }

        const mutationVariables = {
            applicationId: schedulingApplication.applicationId,
            jobId,
            payload: {
                interviewerId,
                scheduledAt,
                durationMinutes,
                meetingLink: scheduleForm.meetingLink.trim(),
                note: scheduleForm.note.trim(),
            },
        };

        if (scheduleForm.interviewId) {
            updateInterviewMutation.mutate({
                ...mutationVariables,
                interviewId: scheduleForm.interviewId,
            });
            return;
        }

        createInterviewMutation.mutate(mutationVariables);
    };

    const isSavingSchedule =
        createInterviewMutation.isPending || updateInterviewMutation.isPending;

    return (
        <div className="space-y-6">
            <PageHeader
                title={data?.jobTitle || 'Kanban'}
                description={`Job #${data?.jobId ?? jobId} • ${data?.totalApplications ?? 0} applications`}
                actions={
                    <Button type="button" variant="outline" onClick={() => navigate('/application')}>
                        <ArrowLeft className="h-4 w-4" />
                        Applications
                    </Button>
                }
            />

            {(isLoading || isFetching) && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-12 text-muted-foreground">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <span>Đang tải Kanban board...</span>
                </div>
            )}

            {isError && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
                    {extractErrorMessage(error, 'Không tải được Kanban board')}
                </div>
            )}

            {!isLoading && !isFetching && !isError && !stages.length && (
                <div className="rounded-lg border bg-background p-6 text-sm text-muted-foreground">
                    Chưa có pipeline stage cho job này.
                </div>
            )}

            {!isLoading && !isFetching && !isError && stages.length > 0 && (
                <div className="mx-auto w-full max-w-[96rem] pb-4">
                    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-[repeat(var(--stage-count),minmax(0,1fr))]" style={{ '--stage-count': stages.length }}>
                        {stages.map((stage) => (
                            <KanbanColumn
                                key={stage.stageId}
                                stage={stage}
                                draggingApplication={draggingApplication}
                                movingApplicationId={movingApplicationId}
                                onDropApplication={handleDropApplication}
                                onDragStart={handleDragStart}
                                onOpenDetail={setDetailApplicationId}
                                onOpenSchedule={handleOpenSchedule}
                                onMoveStage={(applicationId, toStageId) =>
                                    handleMoveStage(applicationId, toStageId, stage.stageId)
                                }
                                onViewCv={handleViewCv}
                                stages={stages}
                            />
                        ))}
                    </div>
                </div>
            )}

            <Dialog
                open={Boolean(schedulingApplication)}
                onOpenChange={(open) => {
                    if (!open) {
                        setSchedulingApplication(null);
                        setScheduleForm(DEFAULT_SCHEDULE_FORM);
                    }
                }}
            >
                <DialogContent className="max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {scheduleForm.interviewId ? 'Chỉnh sửa lịch phỏng vấn' : 'Lên lịch phỏng vấn'}
                        </DialogTitle>
                        <DialogDescription>
                            {schedulingApplication?.candidateName || 'Ứng viên'} - Application #{schedulingApplication?.applicationId}
                        </DialogDescription>
                    </DialogHeader>

                    <form className="space-y-4" onSubmit={handleSubmitSchedule}>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Interviewer</span>
                                <select
                                    value={scheduleForm.interviewerId}
                                    onChange={(event) =>
                                        handleScheduleFieldChange('interviewerId', event.target.value)
                                    }
                                    disabled={isLoadingInterviewers || isInterviewersError}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    required
                                >
                                    <option value="">
                                        {isLoadingInterviewers
                                            ? 'Đang tải interviewer...'
                                            : isInterviewersError
                                                ? 'Không tải được interviewer'
                                                : 'Chọn interviewer'}
                                    </option>
                                    {interviewers.map((interviewer) => (
                                        <option key={interviewer.id} value={interviewer.id}>
                                            {interviewer.fullName || `Interviewer #${interviewer.id}`}
                                            {interviewer.email ? ` - ${interviewer.email}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label className="space-y-2 text-sm">
                                <span className="font-medium">Thời lượng</span>
                                <Input
                                    type="number"
                                    min="1"
                                    value={scheduleForm.durationMinutes}
                                    onChange={(event) =>
                                        handleScheduleFieldChange('durationMinutes', event.target.value)
                                    }
                                    required
                                />
                            </label>
                        </div>

                        <label className="space-y-2 text-sm">
                            <span className="font-medium">Thời gian phỏng vấn</span>
                            <Input
                                type="datetime-local"
                                value={scheduleForm.scheduledAt}
                                onChange={(event) =>
                                    handleScheduleFieldChange('scheduledAt', event.target.value)
                                }
                                required
                            />
                        </label>

                        <label className="space-y-2 text-sm">
                            <span className="font-medium">Meeting link</span>
                            <Input
                                value={scheduleForm.meetingLink}
                                onChange={(event) =>
                                    handleScheduleFieldChange('meetingLink', event.target.value)
                                }
                                placeholder="https://meet.google.com/..."
                            />
                        </label>

                        <label className="space-y-2 text-sm">
                            <span className="font-medium">Ghi chú</span>
                            <Textarea
                                value={scheduleForm.note}
                                onChange={(event) => handleScheduleFieldChange('note', event.target.value)}
                                placeholder="Nội dung cần trao đổi, chuẩn bị..."
                            />
                        </label>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setSchedulingApplication(null);
                                    setScheduleForm(DEFAULT_SCHEDULE_FORM);
                                }}
                                disabled={isSavingSchedule}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={isSavingSchedule}>
                                {isSavingSchedule ? 'Đang lưu...' : 'Lưu lịch hẹn'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                open={Boolean(pendingStageMove)}
                onOpenChange={(open) => !open && setPendingStageMove(null)}
                title={getStageMoveConfirmContent(pendingStageMove?.toStage).title}
                description={getStageMoveConfirmContent(pendingStageMove?.toStage).description}
                confirmText={
                    moveStageMutation.isPending
                        ? 'Đang chuyển...'
                        : getStageMoveConfirmContent(pendingStageMove?.toStage).confirmText
                }
                onConfirm={handleConfirmStageMove}
                loading={moveStageMutation.isPending}
                destructive={getStageMoveConfirmContent(pendingStageMove?.toStage).destructive}
            />

            <Dialog
                open={Boolean(detailApplicationId)}
                onOpenChange={(open) => !open && setDetailApplicationId(null)}
            >
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Chi tiết ứng viên</DialogTitle>
                        <DialogDescription>
                            Application #{detailApplicationId}
                        </DialogDescription>
                    </DialogHeader>

                    {isLoadingApplicationDetail && (
                        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-10 text-muted-foreground">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <span>Đang tải chi tiết ứng viên...</span>
                        </div>
                    )}

                    {isApplicationDetailError && (
                        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
                            {extractErrorMessage(applicationDetailError, 'Không tải được chi tiết ứng viên')}
                        </div>
                    )}

                    {!isLoadingApplicationDetail && !isApplicationDetailError && applicationDetail && (
                        <div className="space-y-6">
                            <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                                <DetailRow label="Ứng viên" value={applicationDetail.candidate?.name} />
                                <DetailRow label="Email" value={applicationDetail.candidate?.email} />
                                <DetailRow label="Số điện thoại" value={applicationDetail.candidate?.phone} />
                                <DetailRow label="Ngày ứng tuyển" value={formatDateTime(applicationDetail.appliedAt)} />
                                <div className="space-y-1">
                                    <div className="text-xs font-medium uppercase text-muted-foreground">
                                        Mức ưu tiên
                                    </div>
                                    {getApplicationPriorityLabel(applicationDetail.priority) ? (
                                        <Badge variant={getApplicationPriorityBadgeVariant(applicationDetail.priority)}>
                                            {getApplicationPriorityDisplayLabel(applicationDetail.priority)}
                                        </Badge>
                                    ) : (
                                        <div className="text-sm">Thường</div>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                                <DetailRow label="Job" value={applicationDetail.job?.title} />
                                <DetailRow label="Địa điểm" value={applicationDetail.job?.location} />
                                <DetailRow label="Stage hiện tại" value={applicationDetail.currentStage?.name} />
                                <div className="space-y-1">
                                    <div className="text-xs font-medium uppercase text-muted-foreground">CV</div>
                                    {applicationDetail.cv?.id ? (
                                        <button
                                            type="button"
                                            onClick={() => handleViewCv(applicationDetail.applicationId, applicationDetail.cv?.fileType)}
                                            className="text-sm text-primary hover:underline cursor-pointer bg-transparent border-0 p-0"
                                        >
                                            Xem CV {applicationDetail.cv.fileType ? `(${applicationDetail.cv.fileType})` : ''}
                                        </button>
                                    ) : (
                                        <div className="text-sm">—</div>
                                    )}
                                </div>
                            </div>

                            <div className="rounded-lg border p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <h3 className="text-sm font-semibold">Lịch phỏng vấn</h3>
                                    {applicationDetail.interview && (
                                        <div className="flex items-center gap-2">
                                            {applicationDetail.interview.status && (
                                                <Badge variant="secondary">{applicationDetail.interview.status}</Badge>
                                            )}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleOpenEditSchedule}
                                            >
                                                Chỉnh sửa
                                            </Button>
                                        </div>
                                    )}
                                </div>
                                {applicationDetail.interview ? (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <DetailRow label="Interviewer" value={applicationDetail.interview.interviewerName} />
                                        <DetailRow label="Thời gian" value={formatDateTime(applicationDetail.interview.scheduledAt)} />
                                        <DetailRow label="Thời lượng" value={`${applicationDetail.interview.durationMinutes ?? '—'} phút`} />
                                        <DetailRow label="Kết quả" value={applicationDetail.interview.result} />
                                        <DetailRow label="Feedback" value={applicationDetail.interview.feedback} />
                                        <div className="space-y-1">
                                            <div className="text-xs font-medium uppercase text-muted-foreground">Meeting link</div>
                                            {applicationDetail.interview.meetingLink ? (
                                                <a
                                                    href={applicationDetail.interview.meetingLink}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="break-words text-sm text-primary hover:underline"
                                                >
                                                    {applicationDetail.interview.meetingLink}
                                                </a>
                                            ) : (
                                                <div className="text-sm">—</div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">Chưa có lịch phỏng vấn.</div>
                                )}
                            </div>

                            <div className="rounded-lg border p-4">
                                <h3 className="mb-3 text-sm font-semibold">Lịch sử stage</h3>
                                {applicationDetail.stageHistory?.length ? (
                                    <div className="space-y-3">
                                        {applicationDetail.stageHistory.map((item) => (
                                            <div key={item.id} className="rounded-md bg-muted/40 p-3 text-sm">
                                                <div className="font-medium">
                                                    {item.fromStage?.name || '—'} → {item.toStage?.name || '—'}
                                                </div>
                                                <div className="text-muted-foreground">{formatDateTime(item.movedAt)}</div>
                                                {item.notes && <div className="mt-1">{item.notes}</div>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground">Chưa có lịch sử stage.</div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
