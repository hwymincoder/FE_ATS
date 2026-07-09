import { useQuery } from '@tanstack/react-query';

import { PIPELINE_STAGE_QUERY_KEYS } from '@/pages/pipeline-stages/constants';
import {
  fetchPipelineStageDetail,
  fetchPipelineStages,
} from '@/pages/pipeline-stages/services/pipeline-stage-service';

export function usePipelineStageList(params) {
  return useQuery({
    queryKey: PIPELINE_STAGE_QUERY_KEYS.list(JSON.stringify(params ?? {})),
    queryFn: () => fetchPipelineStages(params),
    staleTime: 1000 * 60,
  });
}

export function usePipelineStageDetail(id) {
  return useQuery({
    queryKey: PIPELINE_STAGE_QUERY_KEYS.detail(id),
    queryFn: () => fetchPipelineStageDetail(id),
    enabled: Boolean(id),
  });
}
