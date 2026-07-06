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
});

export const fetchInterviewList = async (params) => {
  const response = await http.get(INTERVIEW_ENDPOINTS.LIST, { params });

  if (Array.isArray(response)) {
    return {
      data: response.map(normalizeInterviewResponse),
      total: response.length,
    };
  }

  return {
    data: (response?.items ?? response?.data ?? []).map(normalizeInterviewResponse),
    total: response?.totalItems ?? response?.total ?? 0,
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
