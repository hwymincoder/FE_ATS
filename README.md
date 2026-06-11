# FE_ATS - Frontend Base Framework

Framework frontend xây dựng theo pattern từ **MBF_BHTT_Framework**, dựa trên **React 18 + Vite**, sử dụng **Ant Design** làm UI component library.

---

## Mục lục

- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Khởi tạo project](#khởi-tạo-project)
- [Chạy project](#chạy-project)
- [Tạo Container mới](#tạo-container-mới)
- [Tạo Service mới](#tạo-service-mới)
- [FTUComponent - Base Class](#ftucomponent---base-class)
- [BaseService - Base API Class](#baseservice---base-api-class)
- [Utils & Constants](#utils--constants)
- [i18n - Đa ngôn ngữ](#i18n---đa-ngôn-ngữ)
- [Routing](#routing)
- [Redux Store](#redux-store)
- [Layout System](#layout-system)
- [Pattern quan trọng](#pattern-quan-trọng)
- [Alias Path](#alias-path)

---

## Công nghệ sử dụng

| Category | Technology |
|----------|------------|
| Framework | React 18.3.1 |
| Build Tool | Vite 5.4.11 |
| UI Library | Ant Design 5.21.0 |
| State Management | Redux + Redux Thunk |
| Routing | React Router DOM v6 |
| HTTP Client | Axios |
| i18n | i18next + react-i18next |
| Date | dayjs + moment |
| Utils | lodash, pako |

---

## Cấu trúc thư mục

```
src/
├── components/
│   └── FTUComponent.js           # Base class cho mọi container/page
├── constants/
│   ├── AppPath.js                 # Định nghĩa API endpoints
│   ├── AppProps.js                # Keys cho props dùng chung
│   └── Constants.js              # Hằng số dùng chung (format, status, storage keys)
├── containers/
│   ├── Dashboard.jsx             # Trang chủ
│   ├── Login.jsx                 # Trang đăng nhập
│   └── category/goods/           # Module mẫu (GoodsList, GoodsForm)
├── layouts/
│   ├── MainLayout.jsx            # Layout chính (sidebar + header)
│   └── LoginLayout.jsx           # Layout cho trang login
├── locales/
│   ├── i18n.js                   # Cấu hình i18next
│   ├── vi.json                   # Bản dịch tiếng Việt
│   └── en.json                   # Bản dịch tiếng Anh
├── routes/
│   └── AppRouter.jsx             # Định nghĩa routing + lazy loading
├── services/
│   └── apiClient.js              # Axios instance + BaseService class
├── stores/
│   ├── store.js                  # Redux store + root reducer
│   └── actions.js                # Redux action creators
├── utils/
│   └── commonUtils.js            # Hàm utility dùng chung
├── App.jsx                       # Root component
└── index.jsx                     # React entry point
```

---

## Khởi tạo project

```bash
# Cài đặt dependencies
npm install
```

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cấu hình API URL trong `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## Chạy project

```bash
# Development server (port 3000)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# ESLint check
npm run lint

# Format code với Prettier
npm run format
```

---

## Tạo Container mới

Container là các trang/page trong ứng dụng, được tổ chức theo domain.

### 1. Tạo cấu trúc thư mục

```
src/containers/<domain>/<module>/
├── List.jsx       # Trang danh sách
├── Form.jsx       # Trang thêm/sửa
└── index.js      # Export tất cả
```

### 2. Ví dụ tạo module Goods

```jsx
// src/containers/category/goods/GoodsList.jsx
import React from 'react';
import { Table, Button, Space, message } from 'antd';
import { FTUComponent } from 'components/FTUComponent.js';
import { goodsService } from 'services/category/goodsService.js';

class GoodsList extends FTUComponent {
  state = {
    data: [],
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  };

  componentDidMount() {
    this.loadData();
  }

  loadData = async () => {
    this.setState({ loading: true });
    try {
      const res = await goodsService.getAll();
      this.setState({ data: res.data });
    } catch (e) {
      this.showError(this.trans('error_load_data'));
    } finally {
      this.setState({ loading: false });
    }
  };

  handleDelete = async (record) => {
    try {
      await goodsService.delete(record.id);
      message.success(this.trans('success_delete'));
      this.loadData();
    } catch (e) {
      this.showError(this.trans('error_delete'));
    }
  };

  handleAdd = () => {
    this.gotoPage('goods-form', { mode: 'add' });
  };

  handleEdit = (record) => {
    this.gotoPage('goods-form', { mode: 'edit', id: record.id });
  };

  render() {
    const columns = [
      { title: this.trans('code'), dataIndex: 'code' },
      { title: this.trans('name'), dataIndex: 'name' },
      {
        title: this.trans('actions'),
        render: (_, record) => (
          <Space>
            <Button type="link" onClick={() => this.handleEdit(record)}>
              {this.trans('edit')}
            </Button>
            <Button type="link" danger onClick={() => this.handleDelete(record)}>
              {this.trans('delete')}
            </Button>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <Button type="primary" onClick={this.handleAdd}>
          {this.trans('add_new')}
        </Button>
        <Table
          columns={columns}
          dataSource={this.state.data}
          loading={this.state.loading}
          rowKey="id"
        />
      </div>
    );
  }
}

export default GoodsList;
```

```jsx
// src/containers/category/goods/GoodsForm.jsx
import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { FTUComponent } from 'components/FTUComponent.js';
import { goodsService } from 'services/category/goodsService.js';

class GoodsForm extends FTUComponent {
  state = {
    loading: false,
    mode: 'add',
    recordId: null,
  };

  componentDidMount() {
    const params = this.getProps();
    const mode = params?.mode || 'add';
    const id = params?.id;

    this.setState({ mode, recordId: id });

    if (mode === 'edit' && id) {
      this.loadData(id);
    }
  }

  loadData = async (id) => {
    this.setState({ loading: true });
    try {
      const res = await goodsService.getById(id);
      this.formRef.current?.setFieldsValue(res.data);
    } catch (e) {
      this.showError(this.trans('error_load_data'));
    } finally {
      this.setState({ loading: false });
    }
  };

  handleSave = async (values) => {
    this.setState({ loading: true });
    try {
      if (this.state.mode === 'edit') {
        await goodsService.update(this.state.recordId, values);
      } else {
        await goodsService.create(values);
      }
      this.showSuccess(this.trans('success_save'));
      this.gotoPage('goods-list');
    } catch (e) {
      this.showError(this.trans('error_save'));
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const isEdit = this.state.mode === 'edit';

    return (
      <Card title={this.trans(isEdit ? 'edit_goods' : 'add_goods')}>
        <Form
          ref={this.formRef}
          layout="vertical"
          onFinish={this.handleSave}
        >
          <Form.Item
            name="code"
            label={this.trans('code')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label={this.trans('name')}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={this.state.loading}>
              {this.trans('save')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

export default GoodsForm;
```

### 3. Đăng ký route trong AppRouter.jsx

```jsx
// src/routes/AppRouter.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout.jsx';
import LoginLayout from 'layouts/LoginLayout.jsx';
import Login from 'containers/Login.jsx';
import Dashboard from 'containers/Dashboard.jsx';

// Lazy load các container
const GoodsList = lazy(() => import('containers/category/goods/GoodsList.jsx'));
const GoodsForm = lazy(() => import('containers/category/goods/GoodsForm.jsx'));

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Public routes - Login Layout */}
        <Route element={<LoginLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Private routes - Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/goods/list" element={<GoodsList />} />
          <Route path="/goods/form" element={<GoodsForm />} />
          {/* Thêm route mới ở đây */}
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
```

### 4. Thêm menu item vào MainLayout

```jsx
// src/layouts/MainLayout.jsx
// Thêm vào menu items:
{
  key: 'goods',
  label: this.trans('goods_management'),
  icon: <ShoppingOutlined />,
  children: [
    {
      key: 'goods-list',
      label: this.trans('goods_list'),
      path: '/goods/list',
    },
    {
      key: 'goods-form',
      label: this.trans('goods_form'),
      path: '/goods/form',
    },
  ],
}
```

---

## Tạo Service mới

Service chịu trách nhiệm giao tiếp với API backend.

### 1. Tạo cấu trúc thư mục

```
src/services/<domain>/
├── goodsService.js
└── index.js
```

### 2. Ví dụ GoodsService

```js
// src/services/category/goodsService.js
import { BaseService } from 'services/apiClient.js';

class GoodsService extends BaseService {
  constructor() {
    super('/goods');
  }

  // Custom method - lấy hàng hóa theo danh mục
  getByCategory(categoryId) {
    return apiClient.get(`/goods/category/${categoryId}`);
  }

  // Custom method - tìm kiếm
  search(params) {
    return apiClient.get('/goods/search', { params });
  }
}

// Export singleton instance
export const goodsService = new GoodsService();
```

```js
// src/services/category/index.js
export { goodsService } from './goodsService.js';
```

### 3. BaseService methods có sẵn

| Method | Description |
|--------|-------------|
| `getAll(params)` | Lấy danh sách tất cả bản ghi |
| `getById(id)` | Lấy chi tiết một bản ghi |
| `create(data)` | Tạo mới bản ghi |
| `update(id, data)` | Cập nhật bản ghi |
| `delete(id)` | Xóa bản ghi |

---

## FTUComponent - Base Class

`FTUComponent` là base class kế thừa từ `React.Component`, cung cấp các helper methods dùng chung.

### Sử dụng

```jsx
import { FTUComponent } from 'components/FTUComponent.js';

class MyComponent extends FTUComponent {
  // Toàn bộ methods của FTUComponent đã có sẵn
}
```

### Form & Validation Methods

```js
// Lấy form instance (đã được FTUComponent quản lý)
this.getForm()

// Validate form
this.validateForm()

// Reset form
this.resetForm()

// Set form fields value
this.setFormFieldsValue({ fieldName: 'value' })

// Submit form (khi đã attach với Form component)
this.handleFormSubmit()

// Attach form ref (đặt ref="form" trên component Form)
this.formRef = React.createRef()

// Validate trường cụ thể
this.validateField('fieldName')
```

### i18n Methods

```js
// Dịch text với key
this.trans('key_name')

// Ví dụ:
this.trans('error_not_found')     // → "Không tìm thấy dữ liệu"
this.trans('success_create')       // → "Tạo mới thành công"
```

### Notification Methods

```js
// Hiện thông báo thành công
this.showSuccess(message)

// Hiện thông báo lỗi
this.showError(message)

// Hiện thông báo cảnh báo
this.showWarning(message)

// Hiện thông báo thông tin
this.showInfo(message)
```

### Pagination Methods

```js
// Lấy thông tin phân trang
const pagination = this.getPaginationConfig(total, current, pageSize)

// Gọi khi trang thay đổi
this.handleTableChange(pagination, filters, sorter)
```

### Cache Methods

```js
// Lưu cache
this.setCache(key, value)

// Lấy cache
this.getCache(key)

// Xóa cache
this.removeCache(key)
```

### Navigation Methods

```js
// Chuyển trang với params
this.gotoPage(pageKey, params)

// Lấy params từ URL hoặc navigation state
this.getProps()

// Reload trang hiện tại
this.reloadPage()
```

### Input Formatting Methods

```js
// Format số thành tiền VND
this.formatCurrency(value)

// Format ngày
this.formatDate(value)

// Format datetime
this.formatDateTime(value)
```

### Other Methods

```js
// Debounce function
this.debounce(func, delay)

// Scroll lên đầu trang
this.scrollTop()

// Focus vào element
this.focusElement(ref)

// Print nội dung
this.printContent(content)

// Download file
this.downloadFile(url, filename)
```

---

## BaseService - Base API Class

`BaseService` cung cấp wrapper cho Axios với các tính năng sẵn có.

### Axios Instance (`apiClient`)

```js
import apiClient from 'services/apiClient.js';

// Interceptor đã được cấu hình:
// - Request: tự động thêm Authorization token
// - Response: xử lý 401 → redirect về login
// - Global error handler
```

### Cách sử dụng apiClient trực tiếp

```js
import apiClient from 'services/apiClient.js';

// GET request
apiClient.get('/endpoint', { params: { page: 1 } })

// POST request
apiClient.post('/endpoint', data)

// PUT request
apiClient.put('/endpoint/id', data)

// DELETE request
apiClient.delete('/endpoint/id')

// Với custom headers
apiClient.post('/endpoint', data, {
  headers: { 'X-Custom-Header': 'value' }
})
```

---

## Utils & Constants

### commonUtils.js - Hàm utility dùng chung

```js
import { formatCurrency, debounce, validateEmail } from 'utils/commonUtils.js';

// Format tiền VND
formatCurrency(1000000)  // → "1.000.000 ₫"

// Validate email
validateEmail('test@example.com')  // → true

// Debounce
debounce(fn, 300)
```

### Constants.js - Hằng số dùng chung

```js
import { DATE_FORMAT, DATE_TIME_FORMAT, STORAGE_KEYS } from 'constants/Constants.js';

DATE_FORMAT         // Format ngày: "DD/MM/YYYY"
DATE_TIME_FORMAT    // Format datetime: "DD/MM/YYYY HH:mm:ss"
STORAGE_KEYS.TOKEN  // Key lưu token
```

### AppPath.js - API Endpoints

```js
import { API_PATH } from 'constants/AppPath.js';

API_PATH.GOODS       // → "/goods"
API_PATH.USERS       // → "/users"
// Thêm endpoint mới tại đây
```

---

## i18n - Đa ngôn ngữ

Framework hỗ trợ đa ngôn ngữ với **i18next**.

### Cấu trúc file dịch

```json
// src/locales/vi.json
{
  "welcome": "Chào mừng bạn",
  "goods_management": "Quản lý hàng hóa",
  "add_new": "Thêm mới",
  "edit": "Sửa",
  "delete": "Xóa",
  "save": "Lưu",
  "cancel": "Hủy",
  "success_save": "Lưu thành công",
  "error_save": "Lưu thất bại",
  "error_load_data": "Lỗi tải dữ liệu",
  "confirm_delete": "Bạn có chắc muốn xóa?"
}
```

```json
// src/locales/en.json
{
  "welcome": "Welcome",
  "goods_management": "Goods Management",
  "add_new": "Add New",
  "edit": "Edit",
  "delete": "Delete",
  "save": "Save",
  "cancel": "Cancel",
  "success_save": "Save successfully",
  "error_save": "Save failed",
  "error_load_data": "Failed to load data",
  "confirm_delete": "Are you sure you want to delete?"
}
```

### Sử dụng trong component

```jsx
// Cách 1: Qua FTUComponent
this.trans('add_new')  // → "Thêm mới" / "Add New"

// Cách 2: Dùng hook trực tiếp
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  return <span>{t('welcome')}</span>;
};
```

---

## Routing

### Lazy Loading

Tất cả các page container đều được load lazy để tối ưu performance:

```jsx
import { lazy, Suspense } from 'react';

const GoodsList = lazy(() => import('containers/category/goods/GoodsList.jsx'));

// Wrap trong Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/goods/list" element={<GoodsList />} />
  </Routes>
</Suspense>
```

### Route Guard

Kiểm tra authentication trước khi cho phép truy cập private routes:

```jsx
// PrivateRoute component xử lý redirect khi chưa đăng nhập
```

### Navigation với params

```js
// Chuyển trang kèm params (qua FTUComponent)
this.gotoPage('goods-form', { mode: 'edit', id: 123 });

// Lấy params (trong component đích)
const params = this.getProps();  // → { mode: 'edit', id: 123 }
```

---

## Redux Store

### Cấu trúc

```
stores/
├── store.js      # Cấu hình Redux store + root reducer
└── actions.js    # Action creators dùng chung
```

### Sử dụng Redux trong component

```jsx
import { connect } from 'react-redux';

// Định nghĩa mapStateToProps và mapDispatchToProps
const mapStateToProps = (state) => ({
  user: state.auth.user,
  token: state.auth.token,
});

const mapDispatchToProps = {
  login: actions.login,
  logout: actions.logout,
};

// Kết nối với component
export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);
```

---

## Layout System

### MainLayout

Layout chính của ứng dụng, bao gồm:

- **Header**: Logo, user info, logout
- **Sidebar**: Menu điều hướng (collapsible)
- **Content**: Nội dung chính của page

### LoginLayout

Layout đơn giản cho trang đăng nhập, chỉ bao gồm nội dung chính không có sidebar/header.

```jsx
// Trong AppRouter
<Route element={<LoginLayout />}>
  <Route path="/login" element={<Login />} />
</Route>

<Route element={<MainLayout />}>
  {/* Tất cả private routes */}
</Route>
```

---

## Pattern quan trọng

### 1. FTUComponent Pattern

Tất cả các page container nên kế thừa từ `FTUComponent` thay vì `React.Component`. Điều này đảm bảo:

-统一 cách xử lý form, validation
-统一 cách hiện notification
-统一 cách sử dụng i18n
-统一 cách phân trang

### 2. BaseService Pattern

Tất cả các service nên kế thừa từ `BaseService` và export như singleton instance. Tránh gọi trực tiếp `apiClient` trong component.

### 3. Domain-based Organization

Tổ chức code theo domain/module:

```
containers/
├── category/
│   ├── goods/
│   ├── unit/
│   └── warehouse/
├── sale/
│   ├── orders/
│   └── invoices/
└── inventory/
    ├── stock/
    └── transfer/
```

### 4. Lazy Loading

Luôn sử dụng `lazy()` và `Suspense` cho các page container để tối ưu bundle size.

### 5. i18n

Tất cả text hiển thị cho user phải được dịch qua `trans()` method hoặc `useTranslation()` hook. Không hardcode text tiếng Việt trong code.

### 6. API Error Handling

Luôn wrap API calls trong try-catch và hiện notification phù hợp:

```js
try {
  await goodsService.create(data);
  this.showSuccess(this.trans('success_create'));
} catch (e) {
  this.showError(this.trans('error_create'));
}
```

---

## Alias Path

Framework cấu hình sẵn các path aliases trong `vite.config.js` và `jsconfig.json`:

| Alias | Path |
|-------|------|
| `@/` hoặc `@` | `src/` |
| `components/` | `src/components` |
| `containers/` | `src/containers` |
| `services/` | `src/services` |
| `stores/` | `src/stores` |
| `routes/` | `src/routes` |
| `utils/` | `src/utils` |
| `constants/` | `src/constants` |
| `locales/` | `src/locales` |
| `layouts/` | `src/layouts` |

```js
// Import với alias
import { FTUComponent } from 'components/FTUComponent.js';
import { goodsService } from 'services/category/goodsService.js';
import { API_PATH } from 'constants/AppPath.js';
```
