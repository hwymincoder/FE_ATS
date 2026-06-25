import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

const formatDateTime = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
};

const isUpcoming = (item) => new Date(item.startTime) >= new Date();
const isPast = (item) => new Date(item.endTime) < new Date();

export const InterviewsDataTable = ({ data = [], isLoading, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | past | all

  const grouped = useMemo(() => {
    return {
      upcoming: data.filter((i) => !isPast(i)),
      past: data.filter((i) => isPast(i)),
      all: data,
    };
  }, [data]);

  if (isLoading) return <div>Đang tải...</div>;

  const list = grouped[activeTab] || [];
  if (!list.length) return <div>Không có lịch phỏng vấn.</div>;

  return (
    <div>
      <div className="flex gap-2 border-b pb-2">
        <button
          className={`px-3 py-1 ${activeTab === 'upcoming' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Sắp diễn ra
        </button>
        <button
          className={`px-3 py-1 ${activeTab === 'all' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('all')}
        >
          Tất cả
        </button>
        <button
          className={`px-3 py-1 ${activeTab === 'past' ? 'border-b-2 border-primary' : 'text-muted-foreground'}`}
          onClick={() => setActiveTab('past')}
        >
          Đã diễn ra
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {list.map((it) => (
          <div key={it.id} className="rounded-md border p-4 flex justify-between items-start">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Ứng viên</div>
              <div className="text-lg font-medium">{it.candidateName}</div>

              <div className="mt-2 text-sm">
                <div>
                  <strong>Người phỏng vấn:</strong> {it.interviewerName ?? '-'}
                </div>
                <div>
                  <strong>Thời gian:</strong> {formatDateTime(it.startTime)} - {formatDateTime(it.endTime)}
                </div>
                <div>
                  <strong>Vị trí:</strong> {it.position}
                </div>
                <div>
                  <strong>Meeting:</strong>{' '}
                  {it.meetingLink ? (
                    <a href={it.meetingLink} target="_blank" rel="noreferrer" className="text-primary underline">
                      Mở link
                    </a>
                  ) : (
                    '-'
                  )}
                </div>
                <div>
                  <strong>Kết quả:</strong> {it.result ?? 'Chưa có'}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-sm text-muted-foreground">{it.status}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => onUpdate(it)}>
                  Cập nhật kết quả
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewsDataTable;
