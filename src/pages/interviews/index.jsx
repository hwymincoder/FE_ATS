import React, { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { PageHeader } from '@/components/shared/page-header';
import InterviewsActions from '@/pages/interviews/components/InterviewsActions';
import InterviewsDataTable from '@/pages/interviews/components/InterviewsDataTable';
import InterviewResultDialog from '@/pages/interviews/components/InterviewResultDialog';
import { useInterviewList } from '@/pages/interviews/hooks/useInterviewQueries';
import { useUpdateInterviewResult } from '@/pages/interviews/hooks/useInterviewMutations';
import { DEFAULT_PAGE_SIZE } from '@/pages/interviews/constants';
import { useAuthStore } from '@/stores/auth-store';
import CalendarPlaceholder from '@/pages/interviews/components/CalendarPlaceholder';

export default function InterviewsPage() {
  const queryClient = useQueryClient();
  const actionsRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  // Lọc theo user hiện tại (interviewer)
  const currentUser = useAuthStore((s) => s.user);
  const interviewerId = currentUser?.id ?? null;

  // Bộ lọc ngày và view
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const params = {
    page: currentPage + 1,
    pageSize,
    interviewerId,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  };
  const { data, isLoading, isFetching } = useInterviewList(params);
  const list = data?.data ?? [];

  const updateMutation = useUpdateInterviewResult();

  const handleRefresh = () => queryClient.invalidateQueries({ queryKey: ['interviews'] });

  // seed dev mocks when running in dev mode
  React.useEffect(() => {
    if (import.meta.env.DEV) {
      // dynamic import to avoid including in production bundles
      import('./dev-seed').then((m) => {
        m.seedDevInterviews();
        queryClient.invalidateQueries({ queryKey: ['interviews'] });
      });
    }
  }, []);

  const handleOpenUpdate = (item) => {
    setSelectedInterview(item);
    setIsDialogOpen(true);
  };

  const handleSaveResult = ({ id, payload }) => {
    updateMutation.mutate({ id, payload }, { onSuccess: () => setIsDialogOpen(false) });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Lịch phỏng vấn" description="Danh sách phỏng vấn được gán cho bạn" />

      <div className="flex items-center justify-between gap-4">
        <InterviewsActions ref={actionsRef} onRefresh={handleRefresh} />
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-md border bg-background px-2 py-1"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-md border bg-background px-2 py-1"
          />
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="rounded-md border bg-background px-2 py-1"
          >
            <option value="list">Danh sách</option>
            <option value="calendar">Lịch</option>
          </select>
        </div>
      </div>

      {viewMode === 'list' ? (
        <InterviewsDataTable
          data={list}
          isLoading={isLoading || isFetching}
          onUpdate={handleOpenUpdate}
        />
      ) : (
        <CalendarPlaceholder items={list} onItemClick={handleOpenUpdate} />
      )}

      <InterviewResultDialog
        open={isDialogOpen}
        onOpenChange={(open) => setIsDialogOpen(open)}
        interview={selectedInterview}
        onSave={handleSaveResult}
        saving={updateMutation.isLoading}
      />
    </div>
  );
}
