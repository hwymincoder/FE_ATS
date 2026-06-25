import React, { forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';

const InterviewsActions = forwardRef(({ onSearch, onReset, onRefresh }, ref) => {
  useImperativeHandle(ref, () => ({
    submitForm: () => onSearch?.({}),
    resetForm: () => onReset?.(),
  }));

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onRefresh}>
          Làm mới
        </Button>
      </div>
      <div />
    </div>
  );
});

export default InterviewsActions;
