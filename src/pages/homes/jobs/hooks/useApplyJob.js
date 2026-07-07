import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { extractErrorMessage } from '@/lib/extract-error';

import { jobService } from '../services/job-service';

export function useApplyJob(options = {}) {
  return useMutation({
    mutationFn: ({ jobId, payload, file }) => jobService.applyJob(jobId, payload, file),
    onSuccess: (data) => {
      toast.success(options.successMessage || 'Ứng tuyển thành công. Chúng tôi sẽ liên hệ bạn sớm.');
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, options.errorMessage || 'Ứng tuyển thất bại. Vui lòng thử lại.'));
      options.onError?.(error);
    },
  });
}