/**
 * AppPath - Định nghĩa tất cả API endpoints
 */
export const PATH = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  GET_USER_INFO: '/auth/me',

  // Common
  GET_DATA_AP_DOMAIN: '/common/ap-domain',
  GET_DATA_LIST_AP_DOMAIN: '/common/ap-domain/list',
  DOWNLOAD_FILE: '/common/download',
  UPLOAD_FILE: '/common/upload',
  GET_BREADCRUMB: '/common/breadcrumb',

  // Goods
  GOODS_LIST: '/goods',
  GOODS_GET_BY_ID: '/goods/:id',
  GOODS_CREATE: '/goods',
  GOODS_UPDATE: '/goods/:id',
  GOODS_DELETE: '/goods/:id',
  GOODS_EXPORT: '/goods/export',
  GOODS_IMPORT: '/goods/import',

  // Category
  CATEGORY_LIST: '/categories',
  CATEGORY_GET_BY_ID: '/categories/:id',
  CATEGORY_CREATE: '/categories',
  CATEGORY_UPDATE: '/categories/:id',
  CATEGORY_DELETE: '/categories/:id',

  // Inventory
  INVENTORY_LIST: '/inventory',
  INVENTORY_STOCK_VIEW: '/inventory/stock-view',
  INVENTORY_IMPORT: '/inventory/import',
  INVENTORY_EXPORT: '/inventory/export',

  // Sale
  SALE_TRANS_LIST: '/sale/trans',
  SALE_TRANS_CREATE: '/sale/trans',
  SALE_TRANS_GET_BY_ID: '/sale/trans/:id',

  // User Management
  USER_LIST: '/users',
  USER_GET_BY_ID: '/users/:id',
  USER_CREATE: '/users',
  USER_UPDATE: '/users/:id',
  USER_DELETE: '/users/:id',
  USER_CHANGE_PASSWORD: '/users/:id/change-password',
};

/**
 * SERVICE_CODE - Mã response từ API
 */
export const SERVICE_CODE = {
  SUCC_CODE: 0,
  ERR_CODE: 1,
  SYSTEM_ERROR: -1,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
};
