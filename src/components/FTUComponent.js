import React from 'react';
import { message, Modal } from 'antd';
import Constants from '../constants/Constants.js';
import { stringNullOrEmpty } from '../utils/commonUtils.js';

/**
 * FTUComponent - Base class cho tất cả container/page
 * Kế thừa từ React.Component
 * Cung cấp các helper methods dùng chung cho form, notification, cache...
 */
export class FTUComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      errors: {},
      loading: false,
      pagination: {
        current: 1,
        pageSize: Constants.PAGE_SIZE_DEFAULT,
        total: 0,
      },
    };
  }

  // ==================== TRANSLATION ====================

  /**
   * Lấy text theo key i18n
   * @param {string} name - key translation
   * @param {object} vari - biến thay thế {{var}}
   */
  trans(name, vari) {
    const { t } = this.props;
    if (!t) return name;
    if (vari) {
      return t(name, vari);
    }
    return t(name);
  }

  // ==================== MESSAGE/NOTIFICATION ====================

  showSuccess(ms) {
    message.success(ms || this.trans('common:msg.success'));
  }

  showError(ms) {
    message.error(ms || this.trans('common:error.common'));
  }

  showWarning(ms) {
    message.warning(ms || this.trans('common:msg.warning'));
  }

  showInfo(ms) {
    message.info(ms);
  }

  /**
   * Hiển thị confirm dialog
   * @param {string} ms - Nội dung
   * @param {function} acceptFunc - Hàm khi đồng ý
   * @param {function} cancelFunc - Hàm khi hủy
   */
  showConfirm(ms, acceptFunc, cancelFunc) {
    Modal.confirm({
      title: this.trans('common:msg.confirm'),
      content: ms,
      okText: this.trans('common:btn.confirm'),
      cancelText: this.trans('common:btn.cancel'),
      onOk: () => {
        if (acceptFunc) acceptFunc();
      },
      onCancel: () => {
        if (cancelFunc) cancelFunc();
      },
    });
  }

  /**
   * Hiển thị confirm dialog với footer buttons tùy chỉnh
   */
  showConfirmCustom(ms, okText, cancelText, acceptFunc, cancelFunc) {
    Modal.confirm({
      title: '',
      content: ms,
      okText: okText || this.trans('common:btn.confirm'),
      cancelText: cancelText || this.trans('common:btn.cancel'),
      onOk: () => {
        if (acceptFunc) acceptFunc();
      },
      onCancel: () => {
        if (cancelFunc) cancelFunc();
      },
    });
  }

  // ==================== FORM HANDLERS ====================

  /**
   * Handler cho text input thường
   * @param {string} name - Tên field
   * @param {event} e - Event
   * @param {string} filter - Filter: 'number', 'alpha', 'alpha_number'
   */
  onChangeTxtField(name, e, filter) {
    let value = e.target.value;
    if (filter) {
      value = this.formatInput(value, filter);
    }
    this.onChangeValue(name, value);
  }

  /**
   * Handler cho number input
   */
  onChangeNumberField(name, e) {
    const value = this.formatInput(e.target.value, 'number');
    this.onChangeValue(name, value);
  }

  /**
   * Handler cho select component (Ant Design Select)
   */
  onChangeSelect(name) {
    return (value) => {
      console.log('onChangeSelect', name, value);
      this.onChangeValue(name, value);
    };
  }

  /**
   * Handler cho select detail (lấy thêm thông tin chi tiết)
   */
  onChangeSelectDetail(name, detailField, data, codeField, nameField, value) {
    this.onChangeValue(name, value);
    let detailValue = '';
    if (data && data.length) {
      const found = data.find(item => item[codeField] === value);
      if (found) {
        detailValue = found[nameField];
      }
    }
    this.onChangeValue(detailField, detailValue);
  }

  /**
   * Handler cho checkbox
   */
  onChangeCheckBox(name) {
    return (e) => {
      this.onChangeValue(name, e.target.checked ? Constants.YES : Constants.NO);
    };
  }

  /**
   * Handler cho date picker
   */
  onChangeDate(name, date) {
    this.onChangeValue(name, date);
  }

  /**
   * Handler cho nested object
   * @param {string} parentName - Tên object cha
   * @param {string} childName - Tên field con
   */
  onChangeNestedObject(parentName, childName) {
    return (value) => {
      const parent = this.state.data[parentName] || {};
      const updated = { ...parent, [childName]: value };
      this.onChangeValue(parentName, updated);
    };
  }

  /**
   * Cập nhật giá trị và xóa lỗi cho field
   * @param {string} name - Tên field
   * @param {any} value - Giá trị mới
   */
  async onChangeValue(name, value) {
    // Convert null string to empty
    if (value === 'null' || value === null || value === undefined) {
      value = '';
    }

    // Handle Ant Design Select object format
    if (value && typeof value === 'object' && 'value' in value) {
      value = value.value;
    }

    await this.setState(prevState => ({
      data: {
        ...prevState.data,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: '',
      },
    }));

    if (this.props.options?.dataNew !== undefined) {
      this.props.options.dataNew = this.state.data;
    }
  }

  /**
   * Cập nhật giá trị custom (không xóa errors)
   */
  async onChangeValueCustom(name, value) {
    if (value === 'null' || value === null || value === undefined) {
      value = '';
    }
    if (value && typeof value === 'object' && 'value' in value) {
      value = value.value;
    }

    await this.setState(prevState => ({
      data: {
        ...prevState.data,
        [name]: value,
      },
    }));
  }

  /**
   * Bulk update nhiều fields cùng lúc
   */
  setData(newData) {
    this.setState(prevState => ({
      data: { ...prevState.data, ...newData },
    }));
  }

  /**
   * Reset form về initial state
   */
  resetForm(data = {}) {
    this.setState({
      data: { ...data },
      errors: {},
      loading: false,
    });
  }

  /**
   * Set errors cho form
   */
  setFormErrors(errors) {
    this.setState({ errors: { ...this.state.errors, ...errors } });
  }

  /**
   * Clear all errors
   */
  clearErrors() {
    this.setState({ errors: {} });
  }

  // ==================== INPUT FORMATTING ====================

  /**
   * Format input theo filter
   * @param {string} str - Giá trị input
   * @param {string} filter - Filter type: 'number', 'alpha', 'alpha_number'
   */
  formatInput(str, filter) {
    if (!str) return '';
    str = str.toString().trim();

    if (filter === 'number') {
      return str.replace(/[^0-9]/g, '');
    }

    if (filter === 'alpha_number') {
      // Xóa dấu tiếng Việt + chỉ giữ a-z, 0-9, _
      str = this.removeVietnamese(str);
      return str.replace(/[^a-zA-Z0-9_]/g, '');
    }

    if (filter === 'alpha') {
      str = this.removeVietnamese(str);
      return str.replace(/[^a-zA-Z]/g, '');
    }

    return str;
  }

  /**
   * Loại bỏ dấu tiếng Việt
   */
  removeVietnamese(str) {
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
      .replace(/[đ]/g, 'd');
  }

  // ==================== FOCUS HANDLING ====================

  /**
   * Focus vào element đầu tiên trong form
   */
  focusFirstElement(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const focusable = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const valid = Array.from(focusable).filter(
      el => !el.disabled && !el.hidden && el.tabIndex !== -1
    );
    if (valid.length > 0) {
      valid[0].focus();
    }
  }

  /**
   * Focus vào field có lỗi đầu tiên
   */
  focusInvalidInput(errors) {
    if (!errors || Object.keys(errors).length === 0) return;

    const firstErrorField = Object.keys(errors)[0];
    const element = document.getElementById(firstErrorField);

    if (element) {
      if (element.tabIndex === -1) {
        this.focusEl(element);
      } else {
        element.focus();
      }
    }
  }

  /**
   * Focus vào element cụ thể
   */
  focusEl(element) {
    const focusable = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const valid = Array.from(focusable).filter(
      el => !el.disabled && !el.hidden && el.tabIndex !== -1
    );
    if (valid.length > 0) {
      valid[0].focus();
    }
  }

  /**
   * Focus delayed (sau khi state update xong)
   */
  focusLater(id, timeout = 500) {
    if (stringNullOrEmpty(id)) return;
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        if (element.tabIndex === -1) {
          this.focusEl(element);
        } else {
          element.focus();
        }
      }
    }, timeout);
  }

  // ==================== VALIDATION ====================

  /**
   * Validate required fields
   * @param {string[]} fields - Array field names cần validate
   * @returns {boolean} - true nếu valid
   */
  validateRequired(fields) {
    const errors = {};
    let isValid = true;

    fields.forEach(field => {
      const value = this.state.data[field];
      if (stringNullOrEmpty(value)) {
        errors[field] = this.trans('common:validate.required');
        isValid = false;
      }
    });

    if (!isValid) {
      this.setState({ errors });
      this.focusInvalidInput(errors);
    }

    return isValid;
  }

  /**
   * Validate email field
   */
  validateEmail(field) {
    const value = this.state.data[field];
    if (!stringNullOrEmpty(value)) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.setState(prev => ({
          errors: { ...prev.errors, [field]: this.trans('common:validate.email') },
        }));
        return false;
      }
    }
    return true;
  }

  /**
   * Validate số điện thoại
   */
  validatePhone(field) {
    const value = this.state.data[field];
    if (!stringNullOrEmpty(value)) {
      const phoneRegex = /^(0[0-9]{9,10})$/;
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        this.setState(prev => ({
          errors: { ...prev.errors, [field]: this.trans('common:validate.phone') },
        }));
        return false;
      }
    }
    return true;
  }

  // ==================== PAGINATION ====================

  /**
   * Handle table change (pagination, sort, filter)
   */
  handleTableChange = (pagination) => {
    this.setState(prevState => ({
      pagination: {
        ...prevState.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
    }), () => {
      if (this.loadData) {
        this.loadData();
      }
    });
  };

  /**
   * Set total records cho pagination
   */
  setTotal(total) {
    this.setState(prevState => ({
      pagination: { ...prevState.pagination, total },
    }));
  }

  // ==================== DEFAULT VALUE HELPERS ====================

  getDefaultValue(value, defaultValue = '') {
    return stringNullOrEmpty(value) ? defaultValue : value;
  }

  getDefaultList(lstValues, defaultValue = []) {
    if (lstValues === null || lstValues === undefined) return defaultValue;
    if (!Array.isArray(lstValues)) return defaultValue;
    return lstValues;
  }

  getDate(value, defaultValue = new Date()) {
    if (stringNullOrEmpty(value)) return defaultValue;
    const d = new Date(value);
    return isNaN(d.getTime()) ? defaultValue : d;
  }

  // ==================== CACHE ====================

  /**
   * Lưu cache vào localStorage
   */
  setCache(name, value) {
    try {
      const key = 'CACHE_' + this._getUsername() + '_' + name;
      const jsonStr = JSON.stringify(value);
      localStorage.setItem(key, jsonStr);
    } catch (e) {
      console.error('setCache error:', e);
    }
  }

  /**
   * Lấy cache từ localStorage
   */
  getCache(name, defaultValue = null) {
    try {
      const key = 'CACHE_' + this._getUsername() + '_' + name;
      const jsonStr = localStorage.getItem(key);
      if (jsonStr) {
        return JSON.parse(jsonStr);
      }
    } catch (e) {
      console.error('getCache error:', e);
    }
    return defaultValue;
  }

  /**
   * Xóa cache
   */
  removeCache(name) {
    const key = 'CACHE_' + this._getUsername() + '_' + name;
    localStorage.removeItem(key);
  }

  _getUsername() {
    const user = this.props.user || {};
    return (user.username || 'ANONYMOUS').toUpperCase();
  }

  // ==================== PRINT/DOWNLOAD ====================

  /**
   * Mở file PDF/Blob trong tab mới để in/download
   * @param {Blob|string} sourceView - Blob hoặc URL
   * @param {boolean} isCreateObject - true = tạo blob URL, false = dùng trực tiếp URL
   */
  showDialogPrint(sourceView, isCreateObject = true) {
    if (!sourceView) {
      this.showError(this.trans('common:error.common'));
      return;
    }

    const w = window.open('about:blank', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,width=850,height=' + window.screen.height * 0.9);
    if (!w) {
      alert('Vui lòng cho phép hệ thống mở cửa sổ mới!');
      return;
    }

    setTimeout(() => {
      const iframe = w.document.createElement('iframe');
      iframe.src = isCreateObject ? window.URL.createObjectURL(sourceView) : sourceView;
      iframe.style.width = '100%';
      iframe.style.height = '99%';
      iframe.style.border = 'none';
      w.document.body.appendChild(iframe);
    }, 0);
  }

  /**
   * Download file từ base64 string
   */
  downloadBase64File(base64String, fileName, mimeType) {
    if (!base64String) {
      this.showError(this.trans('common:error.fileNotFound'));
      return;
    }

    const link = document.createElement('a');
    link.href = `data:${mimeType};base64,${base64String}`;
    link.download = fileName;
    link.click();
  }

  /**
   * Download file từ byte array
   */
  downloadByteArray(byteArray, fileName, mimeType) {
    const blob = new Blob([byteArray], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    this.showDialogPrint(blob, false);
  }

  // ==================== TABLE HELPERS ====================

  /**
   * Lấy bản ghi được chọn từ DataTable
   * @param {object} dt - DataTable reference
   * @param {object} data - Record mới thêm/sửa
   * @param {string[]} listKeys - Các trường để so sánh tìm bản ghi
   */
  getSelectedData(dt, data, listKeys = []) {
    if (!dt || !dt.processData) return data || {};

    const listData = dt.processData() || [];
    if (!listData.length) return data || {};

    if (data && listKeys.length) {
      // Tìm bản ghi đang được chọn
      const dataFind = {};
      listKeys.forEach(key => {
        dataFind[key] = data[key];
      });

      const index = listData.findIndex(item => {
        return listKeys.every(key => item[key] === dataFind[key]);
      });

      if (index !== -1) {
        if (dt.state) {
          dt.state.first = index - (index % dt.state.rows);
        }
        return listData[index];
      }
    }

    // Mặc định: chọn bản ghi đầu tiên
    if (dt.state) {
      dt.state.first = 0;
    }
    return listData[0];
  }

  // ==================== WAIT FOR REDUX ====================

  /**
   * Đợi cho user info được load vào Redux store
   * Pattern đặc biệt của MBF để đảm bảo có user info trước khi thao tác
   */
  _resolveWaitRedux(func) {
    setTimeout(() => {
      if (this.props.user?.username) {
        func();
      } else {
        this._resolveWaitRedux(func);
      }
    }, 200);
  }

  waitRedux() {
    return new Promise(resolve => {
      this._resolveWaitRedux(resolve);
    });
  }

  // ==================== STRING HELPERS ====================

  lpad(n, width, z = '0') {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  getStringLength(str) {
    return str ? new Blob([str]).size : 0;
  }
}

/**
 * Hàm so sánh 2 objects (loại bỏ null/undefined)
 */
export function isEqualObjects(obj1, obj2) {
  const notEmpty = (val) => !stringNullOrEmpty(val);
  const filtered1 = Object.fromEntries(Object.entries(obj1 || {}).filter(([, v]) => notEmpty(v)));
  const filtered2 = Object.fromEntries(Object.entries(obj2 || {}).filter(([, v]) => notEmpty(v)));
  return JSON.stringify(filtered1) === JSON.stringify(filtered2);
}
