import React, { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

const formatDateTime = (iso) => {
  if (!iso) return '-';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const pad = (value) => String(value).padStart(2, '0');
  const day = pad(d.getDate());
  const month = pad(d.getMonth() + 1);
  const year = d.getFullYear();
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const getStartTime = (item) => item.scheduledAt || item.startTime;
const getEndTime = (item) => {
  if (item.endTime) return item.endTime;
  const start = getStartTime(item);
  if (!start) return null;
  const minutes = item.durationMinutes ?? 0;
  const date = new Date(start);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
};

const isPast = (item) => {
  if (item.status === 'COMPLETED') return true;
  const endTime = getEndTime(item) || getStartTime(item);
  return endTime ? new Date(endTime) < new Date() : false;
};

const isUpcoming = (item) => !isPast(item);

export const InterviewsDataTable = ({ data = [], isLoading, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('upcoming'); // upcoming | past | all

  const grouped = useMemo(() => {
    const normalized = data.map((item) => ({
      ...item,
      scheduledAt: item.scheduledAt || item.startTime,
      endTime: item.endTime || (() => {
        const start = item.scheduledAt || item.startTime;
        if (!start) return null;
        const date = new Date(start);
        date.setMinutes(date.getMinutes() + (item.durationMinutes ?? 0));
        return date.toISOString();
      })(),
    }));

    return {
      upcoming: normalized.filter((i) => isUpcoming(i)),
      past: normalized.filter((i) => isPast(i)),
      all: normalized,
    };
  }, [data]);

  if (isLoading) return <div>Đang tải...</div>;

  const list = grouped[activeTab] || [];

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

      {list.length === 0 ? (
        <div className="mt-4">Không có lịch phỏng vấn.</div>
      ) : (
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
                    <strong>Thời gian:</strong> {formatDateTime(getStartTime(it))} - {formatDateTime(getEndTime(it))}
                  </div>
                  <div>
                    <strong>Vị trí:</strong> {it.jobTitle || it.position || '-'}
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
      )}
    </div>
  );
};

export default InterviewsDataTable;
