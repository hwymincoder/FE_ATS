export const INTERVIEW_QUERY_KEYS = {
  lists: () => ['interviews', 'list'],
  list: (params) => ['interviews', 'list', params],
  detail: (id) => ['interviews', 'detail', id],
};

export const INTERVIEW_ENDPOINTS = {
  LIST: '/interviewer/schedules',
  UPDATE: (id) => `/interviewer/schedules/${id}/result`,
};

export const DEFAULT_PAGE_SIZE = 10;
