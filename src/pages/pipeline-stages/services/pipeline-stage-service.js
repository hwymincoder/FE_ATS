import { http } from '@/lib/http';
import { PIPELINE_STAGE_ENDPOINTS } from '@/pages/pipeline-stages/constants';

const normalizeListResponse = (response, params = {}) => {
  if (Array.isArray(response)) {
    return {
      data: response,
      total: response.length,
      page: params.page ?? 0,
      pageSize: params.size ?? 10,
      totalPages: response.length ? 1 : 0,
    };
  }

  const data = response?.items ?? response?.data ?? response?.content ?? [];
  return {
    data,
    total: response?.totalItems ?? response?.total ?? response?.totalElements ?? data.length,
    page: response?.page ?? response?.number ?? params.page ?? 0,
    pageSize: response?.size ?? response?.pageSize ?? params.size ?? 10,
    totalPages: response?.totalPages ?? 0,
  };
};

export async function fetchPipelineStages(params) {
  const requestParams = {
    page: params?.page ?? 1,
    size: params?.size ?? 10,
  };
  const response = await http.get(PIPELINE_STAGE_ENDPOINTS.LIST, { params: requestParams });
  return normalizeListResponse(response, requestParams);
}

export function fetchPipelineStageDetail(id) {
  return http.get(PIPELINE_STAGE_ENDPOINTS.DETAIL(id));
}

export function createPipelineStage(payload) {
  return http.post(PIPELINE_STAGE_ENDPOINTS.CREATE, payload);
}

export function updatePipelineStage(id, payload) {
  return http.put(PIPELINE_STAGE_ENDPOINTS.UPDATE(id), payload);
}

export function deletePipelineStage(id) {
  return http.delete(PIPELINE_STAGE_ENDPOINTS.DELETE(id));
}
