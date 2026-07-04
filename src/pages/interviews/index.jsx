import React, { useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { PageHeader } from '@/components/shared/page-header';
import InterviewsActions from '@/pages/interviews/components/InterviewsActions';
import InterviewsDataTable from '@/pages/interviews/components/InterviewsDataTable';
import InterviewResultDialog from '@/pages/interviews/components/InterviewResultDialog';
import { useInterviewList } from '@/pages/interviews/hooks/useInterviewQueries';
import { useUpdateInterviewResult } from '@/pages/interviews/hooks/useInterviewMutations';
import { DEFAULT_PAGE_SIZE } from '@/pages/interviews/constants';
import CalendarPlaceholder from '@/pages/interviews/components/CalendarPlaceholder';

export default function InterviewsPage() {
  const queryClient = useQueryClient();
  const actionsRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const params = {
    page: currentPage + 1,
    size: pageSize,
  };
  const { data, error, isLoading, isFetching } = useInterviewList(params);
  const list = data?.data ?? [];
  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : error.message || JSON.stringify(error)
    : null;

  const parseLocalDate = (value) => {
    if (!value) return null;
    const trimmed = value.trim();
    const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return null;
    const [, day, month, year] = match.map(Number);
    return new Date(year, month - 1, day);
  };

  const filteredList = useMemo(() => {
    if (!dateFrom && !dateTo) return list;

    const fromDate = parseLocalDate(dateFrom);
    const toDate = parseLocalDate(dateTo);
    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    return list.filter((item) => {
      const scheduled = new Date(item.scheduledAt || item.startTime);
      if (dateFrom && fromDate && scheduled < fromDate) return false;
      if (dateTo && toDate && scheduled > toDate) return false;
      return true;
    });
  }, [dateFrom, dateTo, list]);

  const updateMutation = useUpdateInterviewResult();

  const handleRefresh = () => queryClient.invalidateQueries({ queryKey: ['interviews'] });

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
            type="text"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            placeholder="dd/mm/yyyy"
            className="rounded-md border bg-background px-2 py-1"
          />
          <input
            type="text"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            placeholder="dd/mm/yyyy"
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

      {errorMessage ? (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
          <strong>Lỗi API:</strong> {errorMessage}
        </div>
      ) : viewMode === 'list' ? (
        <InterviewsDataTable
          data={filteredList}
          isLoading={isLoading || isFetching}
          onUpdate={handleOpenUpdate}
        />
      ) : (
        <CalendarPlaceholder items={filteredList} onItemClick={handleOpenUpdate} />
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
