import Constants from '../constants/Constants.js';

/**
 * Kiểm tra object/rariable có null hoặc empty không
 */
export const objectNullOrEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string' && obj.trim() === '') return true;
  if (Array.isArray(obj) && obj.length === 0) return true;
  if (typeof obj === 'object' && Object.keys(obj).length === 0) return true;
  return false;
};

/**
 * Kiểm tra string có null hoặc empty không
 */
export const stringNullOrEmpty = (str) => {
  if (str === null || str === undefined) return true;
  if (typeof str === 'string' && str.trim() === '') return true;
  return false;
};

/**
 * Kiểm tra string có rỗng không (cho phép null/undefined trả về false)
 */
export const stringNullOrBlank = (str) => {
  if (str === null || str === undefined) return false;
  return str.trim() === '';
};

/**
 * Lấy giá trị mặc định nếu null/undefined
 */
export const nvl = (value, defaultValue = '') => {
  if (value === null || value === undefined) return defaultValue;
  return value;
};

/**
 * So sánh 2 object (loại bỏ null/undefined)
 */
export const isEqualObjects = (obj1, obj2) => {
  const notEmpty = (val) => !stringNullOrEmpty(val);
  const filtered1 = Object.fromEntries(Object.entries(obj1 || {}).filter(([, v]) => notEmpty(v)));
  const filtered2 = Object.fromEntries(Object.entries(obj2 || {}).filter(([, v]) => notEmpty(v)));
  return JSON.stringify(filtered1) === JSON.stringify(filtered2);
};

/**
 * Clone object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) cloned[key] = deepClone(obj[key]);
    }
    return cloned;
  }
};

/**
 * Lấy giá trị nested property an toàn
 */
export const getNestedValue = (obj, path, defaultValue = null) => {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    if (result === null || result === undefined) return defaultValue;
    result = result[key];
  }
  return result ?? defaultValue;
};

/**
 * Định dạng số tiền VNĐ
 */
export const formatCurrency = (value, suffix = ' ₫') => {
  if (value === null || value === undefined || value === '') return '';
  const num = parseFloat(value);
  if (isNaN(num)) return '';
  return num.toLocaleString('vi-VN') + suffix;
};

/**
 * Loại bỏ dấu tiếng Việt
 */
export const removeAccents = (str) => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/[đ]/g, 'd')
    .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
    .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
    .replace(/[ÌÍỊỈĨ]/g, 'I')
    .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
    .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
    .replace(/[ỲÝỴỶỸ]/g, 'Y')
    .replace(/[Đ]/g, 'D');
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validate phone (VN)
 */
export const isValidPhone = (phone) => {
  const regex = /^(0[0-9]{9,10})$/;
  return regex.test(phone?.replace(/\s/g, ''));
};

/**
 * Convert object to query string
 */
export const toQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  const query = Object.entries(params)
    .filter(([, value]) => value !== null && value !== undefined && value !== '')
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join('&');
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join('&');
  return query ? `?${query}` : '';
};

/**
 * Parse JSON an toàn
 */
export const safeParseJSON = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

/**
 * Lpad number
 */
export const lpad = (n, width, z = '0') => {
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

/**
 * Format date object to string
 */
export const formatDate = (date, format = Constants.DATE_FORMAT) => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = lpad(d.getDate(), 2);
  const month = lpad(d.getMonth() + 1, 2);
  const year = d.getFullYear();
  const hours = lpad(d.getHours(), 2);
  const minutes = lpad(d.getMinutes(), 2);
  const seconds = lpad(d.getSeconds(), 2);

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', year)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * Get file extension
 */
export const getFileExtension = (filename) => {
  if (!filename) return '';
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
