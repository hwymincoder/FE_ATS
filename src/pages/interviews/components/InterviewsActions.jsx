import { forwardRef, useImperativeHandle } from 'react';
import { RefreshCw } from 'lucide-react';

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
          <RefreshCw className="h-4 w-4" />
          Làm mới
        </Button>
      </div>
      <div />
    </div>
  );
});

InterviewsActions.displayName = 'InterviewsActions';

export default InterviewsActions;
