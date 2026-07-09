export const PIPELINE_STAGE_ENDPOINTS = {
  LIST: '/admin/pipeline-stages',
  DETAIL: (id) => `/admin/pipeline-stages/${id}`,
  CREATE: '/admin/pipeline-stages',
  UPDATE: (id) => `/admin/pipeline-stages/${id}`,
  DELETE: (id) => `/admin/pipeline-stages/${id}`,
};

export const PIPELINE_STAGE_QUERY_KEYS = {
  all: ['pipeline-stages'],
  lists: () => ['pipeline-stages', 'list'],
  list: (params) => ['pipeline-stages', 'list', params],
  detail: (id) => ['pipeline-stages', 'detail', String(id)],
};

export const DEFAULT_PAGE_SIZE = 10;
