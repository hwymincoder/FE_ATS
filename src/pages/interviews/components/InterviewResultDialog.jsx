import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const InterviewResultDialog = ({ open, onOpenChange, interview, onSave, saving }) => {
  const [result, setResult] = useState(interview?.result ?? '');
  const [note, setNote] = useState('');

  useEffect(() => {
    setResult(interview?.result ?? '');
    setNote('');
  }, [interview]);

  const handleSave = () => {
    if (!interview) return;
    onSave({ id: interview.id, payload: { result, note, status: 'FINISHED' } });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cập nhật kết quả phỏng vấn</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div>
            <div className="text-sm text-muted-foreground">Ứng viên</div>
            <div className="font-medium">{interview?.candidateName ?? '-'}</div>

            <div className="text-sm text-muted-foreground mt-2">Người phỏng vấn</div>
            <div>{interview?.interviewerName ?? '-'}</div>

            <div className="text-sm text-muted-foreground mt-2">Thời gian</div>
            <div>
              {interview?.startTime ? new Date(interview.startTime).toLocaleString() : '-'} -{' '}
              {interview?.endTime ? new Date(interview.endTime).toLocaleString() : '-'}
            </div>

            <div className="text-sm text-muted-foreground mt-2">Meeting</div>
            <div>
              {interview?.meetingLink ? (
                <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="text-primary underline">
                  Mở link cuộc họp
                </a>
              ) : (
                '-'
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Kết quả</label>
            <select
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-2 py-1"
            >
              <option value="">Chưa có</option>
              <option value="PASS">Đậu</option>
              <option value="FAIL">Trượt</option>
              <option value="HOLD">Giữ</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Ghi chú</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-1 w-full rounded-md border bg-background px-2 py-1"
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Huỷ
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InterviewResultDialog;
