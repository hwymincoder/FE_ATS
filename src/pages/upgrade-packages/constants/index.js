export const UPGRADE_PACKAGE_ENDPOINTS = {
  LIST: '/admin/upgrade-packages',
  DETAIL: (id) => `/admin/upgrade-packages/${id}`,
  CREATE: '/admin/upgrade-packages',
  UPDATE: (id) => `/admin/upgrade-packages/${id}`,
  DELETE: (id) => `/admin/upgrade-packages/${id}`,
};

export const UPGRADE_PACKAGE_QUERY_KEYS = {
  all: ['upgrade-packages'],
  lists: () => ['upgrade-packages', 'list'],
  list: (params) => ['upgrade-packages', 'list', params],
  detail: (id) => ['upgrade-packages', 'detail', String(id)],
};

export const DEFAULT_PAGE_SIZE = 10;
