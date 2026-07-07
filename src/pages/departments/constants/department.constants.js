
export const DEPARTMENT_ENDPOINTS = {
  LIST: '/admin/departments',
  DETAIL: (id) => `/admin/departments/${id}`,
  CREATE: '/admin/departments',
  UPDATE: (id) => `/admin/departments/${id}`,
  DELETE: (id) => `/admin/departments/${id}`,
};

/** @type {{ LIST: string }} */
export const DEPARTMENT_ROUTES = {
  LIST: '/departments',
};

export const DEFAULT_PAGE_SIZE = 10;

export const DEPARTMENT_QUERY_KEYS = {
  all: ['departments'],
  lists: () => ['departments', 'list'],
  list: (filters) => ['departments', 'list', filters],
  details: () => ['departments', 'detail'],
  detail: (id) => ['departments', 'detail', String(id)],
};
