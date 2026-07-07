import React from 'react';

const CalendarPlaceholder = ({ items = [], onItemClick }) => {
  if (!items.length) return <div>Không có sự kiện để hiển thị trên lịch.</div>;

  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="text-sm text-muted-foreground">Calendar view (placeholder)</div>
      {items.map((it) => (
        <div
          key={it.id}
          className="rounded-md border p-3 hover:bg-accent cursor-pointer"
          onClick={() => onItemClick(it)}
        >
          <div className="font-medium">{it.candidateName}</div>
          <div className="text-sm text-muted-foreground">{it.jobTitle || it.position}</div>
          <div className="text-sm">{new Date(it.scheduledAt || it.startTime).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
};

export default CalendarPlaceholder;
