export const DEPARTMENT_ENDPOINTS = {
  LIST: '/api/departments',
  DETAIL: (id) => `/api/departments/${id}`,
  CREATE: '/api/departments',
  UPDATE: (id) => `/api/departments/${id}`,
  DELETE: '/api/departments',
};

export const DEPARTMENT_ROUTES = {
  LIST: '/departments',
  NEW: '/departments/new',
  EDIT: (id) => `/departments/${id}`,
};

export const DEPARTMENT_QUERY_KEYS = {
  all: ['departments'],
  detail: (id) => ['departments', id],
};
