import { http } from '@/lib/http';
import { INTERVIEW_ENDPOINTS } from '@/pages/interviews/constants';

// Helper: read mock from localStorage if present (used for dev seeding)
const readLocalMocks = () => {
  try {
    const raw = localStorage.getItem('mock_interviews');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return null;
  } catch {
    return null;
  }
};

export const fetchInterviewList = async (params) => {
  // prefer local dev mocks if present
  const local = readLocalMocks();
  if (local) {
    // naive filtering by interviewerId/date range
    let filtered = local;
    if (params?.interviewerId) {
      filtered = filtered.filter((i) => String(i.interviewerId) === String(params.interviewerId));
    }
    if (params?.dateFrom) {
      filtered = filtered.filter((i) => new Date(i.startTime) >= new Date(params.dateFrom));
    }
    if (params?.dateTo) {
      filtered = filtered.filter((i) => new Date(i.endTime) <= new Date(params.dateTo));
    }
    return { data: filtered, total: filtered.length };
  }

  try {
    const response = await http.get(INTERVIEW_ENDPOINTS.LIST, { params });
    if (Array.isArray(response)) {
      return { data: response, total: response.length };
    }
    return { data: response?.data ?? [], total: response?.total ?? 0 };
  } catch (err) {
    // fallback empty
    return { data: [], total: 0 };
  }
};

export const updateInterviewResult = async (id, payload) => {
  // if local mocks present, update them in-place for dev
  const local = readLocalMocks();
  if (local) {
    const idx = local.findIndex((i) => String(i.id) === String(id));
    if (idx >= 0) {
      local[idx] = { ...local[idx], ...payload };
      localStorage.setItem('mock_interviews', JSON.stringify(local));
      return local[idx];
    }
  }

  try {
    return await http.put(INTERVIEW_ENDPOINTS.UPDATE(id), payload);
  } catch (err) {
    return { ...payload, id };
  }
};

export const interviewService = {
  fetchInterviewList,
  updateInterviewResult,
};
