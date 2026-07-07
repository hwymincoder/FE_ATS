import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { INTERVIEW_QUERY_KEYS } from '@/pages/interviews/constants';
import { updateInterviewResult } from '@/pages/interviews/services/interview-service';

export const useUpdateInterviewResult = (options = {}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateInterviewResult(id, payload),
    onSuccess: (data) => {
      toast.success(options.successMessage || 'Cập nhật kết quả phỏng vấn thành công');

      queryClient.invalidateQueries({ queryKey: INTERVIEW_QUERY_KEYS.lists(), exact: false });
      options.onSuccess?.(data);
    },
    onError: (err) => {
      toast.error(options.errorMessage || 'Cập nhật kết quả thất bại');
    },
  });
};
