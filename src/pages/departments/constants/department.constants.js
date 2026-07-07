
export const DEPARTMENT_ENDPOINTS = {
  LIST: '/departments',
  DETAIL: (id) => `/departments/${id}`,
  CREATE: '/departments',
  UPDATE: (id) => `/departments/${id}`,
  DELETE: (id) => `/departments/${id}`,
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
