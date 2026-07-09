export const USER_ENDPOINTS = {
  LIST: '/admin/users',
  ROLES: '/admin/users/roles',
  STATUSES: '/admin/users/statuses',
  DETAIL: (id) => `/admin/users/${id}`,
  CREATE: '/admin/users',
  UPDATE: (id) => `/admin/users/${id}`,
  TOGGLE_STATUS: (id) => `/admin/users/${id}/toggle-status`,
  DELETE: (id) => `/admin/users/${id}`,
};

export const USER_QUERY_KEYS = {
  all: ['users'],
  lists: () => ['users', 'list'],
  list: (params) => ['users', 'list', params],
  detail: (id) => ['users', 'detail', String(id)],
  roles: ['users', 'roles'],
  statuses: ['users', 'statuses'],
};

export const DEFAULT_PAGE_SIZE = 10;

export const USER_ROLE_LABELS = {
  ADMIN: 'Quản trị viên',
  RECRUITER: 'Nhân sự tuyển dụng',
  INTERVIEWER: 'Người phỏng vấn',
  CANDIDATE: 'Ứng viên',
};

export const USER_STATUS_LABELS = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngừng hoạt động',
};
