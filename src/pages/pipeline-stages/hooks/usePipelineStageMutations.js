import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { extractErrorMessage } from '@/lib/extract-error';
import { PIPELINE_STAGE_QUERY_KEYS } from '@/pages/pipeline-stages/constants';
import {
  createPipelineStage,
  deletePipelineStage,
  updatePipelineStage,
} from '@/pages/pipeline-stages/services/pipeline-stage-service';

export function useCreatePipelineStage(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPipelineStage,
    onSuccess: (data) => {
      toast.success('Thêm giai đoạn tuyển dụng thành công');
      queryClient.invalidateQueries({ queryKey: PIPELINE_STAGE_QUERY_KEYS.lists() });
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Thêm giai đoạn tuyển dụng thất bại'));
    },
  });
}

export function useUpdatePipelineStage(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => updatePipelineStage(id, payload),
    onSuccess: (data, variables) => {
      toast.success('Cập nhật giai đoạn tuyển dụng thành công');
      queryClient.invalidateQueries({ queryKey: PIPELINE_STAGE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PIPELINE_STAGE_QUERY_KEYS.detail(variables.id) });
      options.onSuccess?.(data);
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Cập nhật giai đoạn tuyển dụng thất bại'));
    },
  });
}

export function useDeletePipelineStage(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePipelineStage,
    onSuccess: () => {
      toast.success('Xóa giai đoạn tuyển dụng thành công');
      queryClient.invalidateQueries({ queryKey: PIPELINE_STAGE_QUERY_KEYS.lists() });
      options.onSuccess?.();
    },
    onError: (error) => {
      toast.error(extractErrorMessage(error, 'Xóa giai đoạn tuyển dụng thất bại'));
    },
  });
}
