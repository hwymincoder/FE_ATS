export const JOB_ENDPOINTS = {
  POSTED: '/recruiter/jobs/getAll',
};

export const JOB_QUERY_KEYS = {
  all: ['home', 'jobs', 'posted'],
  posted: (params) => ['home', 'jobs', 'posted', params],
};

export const JOB_DEFAULTS = {
  page: 1,
  size: 8,
};
