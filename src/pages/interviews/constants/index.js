export const INTERVIEW_QUERY_KEYS = {
  lists: () => ['interviews', 'list'],
  list: (params) => ['interviews', 'list', params],
  detail: (id) => ['interviews', 'detail', id],
};

export const INTERVIEW_ENDPOINTS = {
  LIST: '/interviews',
  DETAIL: (id) => `/interviews/${id}`,
  UPDATE: (id) => `/interviews/${id}`,
};

export const DEFAULT_PAGE_SIZE = 10;
