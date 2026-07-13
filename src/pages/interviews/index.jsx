import { useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { PageHeader } from '@/components/shared/page-header';
import InterviewsActions from '@/pages/interviews/components/InterviewsActions';
import InterviewsDataTable from '@/pages/interviews/components/InterviewsDataTable';
import { useInterviewList } from '@/pages/interviews/hooks/useInterviewQueries';
import { useUpdateInterviewResult } from '@/pages/interviews/hooks/useInterviewMutations';
import { DEFAULT_PAGE_SIZE } from '@/pages/interviews/constants';

const getStartOfWeek = (date) => {
  const next = new Date(date);
  const day = next.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  next.setDate(next.getDate() + diff);
  next.setHours(0, 0, 0, 0);
  return next;
};

export default function InterviewsPage() {
  const queryClient = useQueryClient();
  const actionsRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [weekStart, setWeekStart] = useState(() => getStartOfWeek(new Date()));

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const params = {
    page: currentPage,
    size: pageSize,
  };
  const { data, error, isLoading, isFetching } = useInterviewList(params);
  const updateResultMutation = useUpdateInterviewResult({
    onSuccess: (updatedInterview) => setSelectedInterview(updatedInterview),
  });
  const list = data?.items ?? data?.data ?? [];
  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : error.message || JSON.stringify(error)
    : null;

  const weekEnd = useMemo(() => {
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  }, [weekStart]);

  const handleRefresh = () => queryClient.invalidateQueries({ queryKey: ['interviews'] });

  const handleOpenDetail = (item) => {
    setSelectedInterview(item);
    setIsDialogOpen(true);
  };

  const handleChangeWeek = (amount) => {
    setWeekStart((current) => {
      const next = new Date(current);
      next.setDate(next.getDate() + amount * 7);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lịch phỏng vấn"
        description="Bảng lịch phỏng vấn hằng tuần được gán cho bạn"
      />

      {/*<div className="flex items-center justify-between">*/}
      {/*  <InterviewsActions ref={actionsRef} onRefresh={handleRefresh} />*/}
      {/*</div>*/}

      {errorMessage ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <strong>Lỗi API:</strong> {errorMessage}
        </div>
      ) : (
        <InterviewsDataTable
          data={list}
          isLoading={isLoading || isFetching}
          weekStart={weekStart}
          weekEnd={weekEnd}
          onWeekChange={handleChangeWeek}
          onWeekSelect={(date) => setWeekStart(getStartOfWeek(date))}
          onResetWeek={() => setWeekStart(getStartOfWeek(new Date()))}
          onViewDetail={handleOpenDetail}
          onUpdateResult={({ id, payload }) => updateResultMutation.mutate({ id, payload })}
          updatingResult={updateResultMutation.isPending || updateResultMutation.isLoading}
          selectedInterview={selectedInterview}
          detailOpen={isDialogOpen}
          onDetailOpenChange={setIsDialogOpen}
          totalItems={data?.totalItems ?? list.length}
        />
      )}
    </div>
  );
}
