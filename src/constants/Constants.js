/**
 * Constants - Hằng số dùng chung toàn app
 */
export default {
  // Date format
  DATE_FORMAT: 'DD/MM/YYYY',
  DATE_TIME_FORMAT: 'DD/MM/YYYY HH:mm:ss',
  TIME_FORMAT: 'HH:mm:ss',
  MONTH_YEAR_FORMAT: 'MM/YYYY',

  // Pagination
  PAGE_SIZE_DEFAULT: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],

  // Cache keys
  CACHE_USER: 'CACHE_USER',
  CACHE_TOKEN: 'CACHE_TOKEN',
  CACHE_PERMISSIONS: 'CACHE_PERMISSIONS',
  CACHE_MENU: 'CACHE_MENU',
  CACHE_APP_CONFIG: 'CACHE_APP_CONFIG',

  // Local storage keys
  LS_TOKEN: 'TOKEN',
  LS_USER: 'USER_INFO',
  LS_LANGUAGE: 'LANGUAGE',
  LS_REFRESH_TOKEN: 'REFRESH_TOKEN',

  // Session storage keys
  SS_LAST_PATH: 'LAST_PATH',

  // File size limit (bytes)
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],

  // Status
  STATUS_ACTIVE: '1',
  STATUS_INACTIVE: '0',
  STATUS_PENDING: 'PENDING',
  STATUS_APPROVED: 'APPROVED',
  STATUS_REJECTED: 'REJECTED',

  // Yes/No
  YES: '1',
  NO: '0',
};
