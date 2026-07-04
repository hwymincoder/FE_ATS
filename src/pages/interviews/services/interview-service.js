import { http } from '@/lib/http';
import { INTERVIEW_ENDPOINTS } from '@/pages/interviews/constants';
import { useAuthStore } from '@/stores/auth-store';

const normalizeInterviewResponse = (item) => ({
  ...item,
  scheduledAt: item.scheduledAt || item.startTime,
  durationMinutes: item.durationMinutes ?? (item.endTime && item.startTime ? Math.max(Math.round((new Date(item.endTime) - new Date(item.startTime)) / 60000), 0) : undefined),
  jobTitle: item.jobTitle || item.position,
  feedback: item.feedback ?? item.note ?? item.feedBack,
});

const parseStoredAuth = () => {
  try {
    const raw = localStorage.getItem('fe-ats-auth');
    if (!raw) return { token: null, email: null };
    const parsed = JSON.parse(raw);
    if (!parsed) return { token: null, email: null };

    const token = typeof parsed === 'string'
      ? parsed
      : parsed.token ?? parsed.state?.token ?? null;
    const user = parsed.user ?? parsed.state?.user ?? null;
    const email = user?.email ?? user?.username ?? null;

    return { token, email };
  } catch {
    return { token: null, email: null };
  }
};

const resolveDevEmail = (email) => {
  if (!email) return null;
  if (email === 'dev@local') return 'interviewer@ats.local';
  return email;
};

export const fetchInterviewList = async (params) => {
  const storedAuth = parseStoredAuth();
  let token = useAuthStore.getState().token || storedAuth.token;
  const email = useAuthStore.getState().user?.email || storedAuth.email;

  if (!token && import.meta.env.DEV && email) {
    try {
      const devToken = await http.get('/api/dev/token', { params: { email: resolveDevEmail(email) } });
      if (devToken) {
        token = devToken;
        try {
          const raw = localStorage.getItem('fe-ats-auth');
          const parsed = raw ? JSON.parse(raw) : {};
          localStorage.setItem('fe-ats-auth', JSON.stringify({
            ...parsed,
            state: {
              ...(parsed?.state ?? {}),
              token,
            },
          }));
        } catch {}
      }
    } catch (e) {
      // ignore
    }
  }

  try {
    const config = { params };
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    const response = await http.get(INTERVIEW_ENDPOINTS.LIST, config);
    if (Array.isArray(response)) {
      return { data: response.map(normalizeInterviewResponse), total: response.length };
    }
    return {
      data: (response?.items ?? response?.data ?? []).map(normalizeInterviewResponse),
      total: response?.totalItems ?? response?.total ?? 0,
    };
  } catch (err) {
    throw err;
  }
};

export const updateInterviewResult = async (id, payload) => {
  const body = {
    result: payload.result,
    feedback: payload.feedback,
  };

  const { token: storedToken, email: storedEmail } = parseStoredAuth();

  try {
    let token = useAuthStore.getState().token || storedToken;
    const email = useAuthStore.getState().user?.email || storedEmail;
    if (!token && import.meta.env.DEV && email) {
      try {
        const devToken = await http.get('/api/dev/token', { params: { email: resolveDevEmail(email) } });
        if (devToken) {
          token = devToken;
          try {
            const raw = localStorage.getItem('fe-ats-auth');
            const parsed = raw ? JSON.parse(raw) : {};
            localStorage.setItem('fe-ats-auth', JSON.stringify({
              ...parsed,
              state: {
                ...(parsed?.state ?? {}),
                token,
              },
            }));
          } catch {}
        }
      } catch (e) {
        // ignore
      }
    }
    const config = {};
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    const response = await http.post(INTERVIEW_ENDPOINTS.UPDATE(id), body, config);
    return normalizeInterviewResponse(response);
  } catch (err) {
    return normalizeInterviewResponse({ ...payload, id });
  }
};

export const interviewService = {
  fetchInterviewList,
  updateInterviewResult,
};
