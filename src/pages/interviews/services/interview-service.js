import { http } from '@/lib/http';
import { INTERVIEW_ENDPOINTS } from '@/pages/interviews/constants';

const normalizeInterviewResponse = (item) => ({
  ...item,
  scheduledAt: item.scheduledAt || item.startTime,
  durationMinutes:
    item.durationMinutes ??
    (item.endTime && item.startTime
      ? Math.max(Math.round((new Date(item.endTime) - new Date(item.startTime)) / 60000), 0)
      : undefined),
  jobTitle: item.jobTitle || item.position,
  feedback: item.feedback ?? item.note ?? item.feedBack,
  candidateName: item.candidateName || item.candidate?.name,
  candidateEmail: item.candidateEmail || item.candidate?.email,
  candidatePhone: item.candidatePhone || item.candidate?.phone,
});

export const fetchInterviewList = async (params) => {
  const normalizedParams = {
    page: Math.max(Number(params?.page ?? 1), 1),
    size: Number(params?.size ?? 10),
  };
  const response = await http.get(INTERVIEW_ENDPOINTS.LIST, { params: normalizedParams });

  if (Array.isArray(response)) {
    const items = response.map(normalizeInterviewResponse);
    return {
      items,
      data: items,
      page: normalizedParams.page,
      size: normalizedParams.size,
      totalItems: response.length,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    };
  }

  const items = (response?.items ?? response?.data ?? []).map(normalizeInterviewResponse);

  return {
    ...response,
    items,
    data: items,
    page: Number(response?.page ?? normalizedParams.page),
    size: Number(response?.size ?? normalizedParams.size),
    totalItems: Number(response?.totalItems ?? response?.total ?? items.length),
    totalPages: Number(response?.totalPages ?? 1),
    hasNext: Boolean(response?.hasNext),
    hasPrevious: Boolean(response?.hasPrevious),
  };
};

export const updateInterviewResult = async (id, payload) => {
  const response = await http.post(INTERVIEW_ENDPOINTS.UPDATE(id), {
    result: payload.result,
    feedback: payload.feedback,
  });

  return normalizeInterviewResponse(response);
};

export const interviewService = {
  fetchInterviewList,
  updateInterviewResult,
};
