# Project Rules — ATS Frontend

## 1. Tổng quan

Dự án frontend cho hệ thống ATS (Application Tracking System). Sử dụng **React + JavaScript** (không TypeScript).

```
ATS_WEB/
├── FE_ATS/    ← Frontend (React) — cổng 3000
└── BE_ATS/    ← Backend (Spring Boot) — cổng 8080
```

## 2. Tech Stack

| Lớp | Công nghệ | File / Thư viện |
|---|---|---|
| Build | **Vite 5** | `vite.config.js` |
| UI | **React 18** + **shadcn/ui** | `src/components/ui/` |
| Style | **Tailwind CSS 3** | `tailwind.config.js`, `src/styles/globals.css` |
| Routing | **react-router-dom v6** | `src/routes/` |
| Server state | **@tanstack/react-query v5** | `src/App.jsx` (QueryClient) |
| Client state | **Zustand v5** | `src/stores/` |
| Form | **react-hook-form + Zod** | `src/schemas/` |
| HTTP | **axios** | `src/lib/http.js` |
| Toast | **sonner** | `src/App.jsx` (Toaster) |
| Icons | **lucide-react** | Dùng trong toàn bộ component |
| Package manager | **npm** | `package.json` |

## 3. Cấu trúc thư mục

```
src/
├── assets/                   # Logo, ảnh tĩnh
├── components/
│   ├── ui/                   # shadcn components (button, card, dialog…)
│   ├── layout/               # (Để mở rộng) layout component riêng
│   └── shared/               # Component nghiệp vụ dùng chung
│       ├── confirm-dialog.jsx  # Hộp xác nhận xóa
│       ├── loading.jsx         # Spinner khi tải
│       └── page-header.jsx     # Tiêu đề + nút hành động trang
├── configs/
│   └── routes.js             # ROUTES + NAV_ITEMS (sidebar)
├── constants/
│   ├── index.js              # APP_NAME, ROLES, STATUS, STORAGE_KEYS
│   └── api-endpoints.js      # API endpoints (auth)
├── features/                 # Chia theo nghiệp vụ (feature-based)
│   └── departments/
│       ├── components/       # DepartmentList, DepartmentForm
│       ├── services/         # department-service.js + department-queries.js
│       ├── constants/        # DEPARTMENT_ENDPOINTS, DEPARTMENT_ROUTES, QUERY_KEYS
│       ├── types/            # JSDoc typedef (thay TypeScript)
│       └── index.js          # Barrel export
├── hooks/                    # Custom hooks
├── layouts/
│   ├── auth-layout.jsx       # Layout /login (centered card)
│   └── main-layout.jsx       # Sidebar + Header + <Outlet/>
├── lib/
│   ├── utils.js              # cn() — merge Tailwind className
│   ├── http.js               # Axios instance + interceptors
│   └── extract-error.js     # Lấy message lỗi từ response
├── pages/                    # Trang root (/login, /dashboard)
├── routes/                   # Routing: index, protected, public, private
├── schemas/                 # Zod schema (validate form)
├── services/                 # API calls (auth)
├── stores/                   # Zustand: auth-store, ui-store
├── styles/
│   └── globals.css           # Tailwind + CSS variables (shadcn)
├── App.jsx                   # Provider stack (QueryClient + Toaster)
└── main.jsx                  # createRoot — entry point
```

## 4. Luồng hoạt động

```
main.jsx
  └─ App.jsx                     (QueryClientProvider + Toaster)
       └─ AppRouter
            ├─ AuthLayout        → /login
            └─ ProtectedRoute    → MainLayout
                                     ├─ Sidebar (NAV_ITEMS)
                                     ├─ Header (user dropdown)
                                     └─ <Outlet/> → trang nghiệp vụ
```

## 5. Quy tắc đặt tên

### 5.1. File

| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Component (JSX) | PascalCase | `DepartmentList.jsx`, `ConfirmDialog.jsx` |
| Hook | camelCase, prefix `use` | `use-auth.js`, `use-pagination.js` |
| Store | camelCase | `auth-store.js`, `ui-store.js` |
| Service | kebab-case, suffix `.service.js` | `auth-service.js`, `department-service.js` |
| Query hooks | kebab-case, suffix `.queries.js` | `department-queries.js` |
| Schema | kebab-case, suffix `-schema.js` | `login-schema.js` |
| Constants | kebab-case hoặc camelCase | `api-endpoints.js`, `index.js` |
| Utils | kebab-case, suffix `.utils.js` | `extract-error.js` |

### 5.2. Code

| Loại | Quy tắc | Ví dụ |
|---|---|---|
| Component function | PascalCase | `export default function DepartmentList()` |
| Hook | camelCase, prefix `use` | `export function useDepartmentList()` |
| Hàm / biến | camelCase | `const handleDelete = () => {}` |
| Hằng số | UPPER_SNAKE_CASE | `export const APP_NAME`, `STORAGE_KEYS.AUTH` |
| Props trong JSDoc | camelCase | `@param {string} departmentName` |

## 6. Import & Path Alias

**Dùng `@/`** cho mọi import từ `src/`. Không dùng đường dẫn tương đối dài.

```js
// ✅ Tốt
import { Button } from '@/components/ui/button';
import { useDepartmentList } from '@/features/departments/services/department-queries';

// ❌ Tránh
import Button from '../../../../components/ui/button';
```

Alias `@/` được định nghĩa trong:
- `vite.config.js` → `resolve.alias`
- (Nên tạo `jsconfig.json` để editor nhận diện)

## 7. Component

### 7.1. Viết component

```jsx
// ✅ Tốt
export default function DepartmentList() {
  const navigate = useNavigate();
  // ...
  return <div>...</div>;
}

// ❌ Tránh
export default function departmentList() {
  // tên phải PascalCase
}
```

### 7.2. Props interface

Dùng **JSDoc** comment (thay vì TypeScript interface):

```js
/**
 * @typedef {Object} Department
 * @property {number} id
 * @property {number|null} parentId
 * @property {string} departmentName
 * @property {string} [description]
 */
```

### 7.3. Barrel export

Mỗi feature có `index.js` export tất cả public API:

```js
// ✅ Tốt
export { default as DepartmentList } from './components/DepartmentList';
export { useDepartmentList, useCreateDepartment } from './services/department-queries';
export { DEPARTMENT_ENDPOINTS, DEPARTMENT_ROUTES } from './constants';

// ❌ Tránh: import từng file riêng lẻ
import DepartmentList from '@/features/departments/components/DepartmentList';
```

### 7.4. Shared components dùng chung

| Component | Mục đích | Props chính |
|---|---|---|
| `PageHeader` | Tiêu đề trang + nút hành động | `title`, `description`, `actions` |
| `Loading` | Spinner khi tải | `text` |
| `ConfirmDialog` | Hộp xác nhận (xóa, hủy…) | `title`, `description`, `onConfirm`, `destructive` |

## 8. State Management

### 8.1. Phân chia 4 loại state

| Loại | Công cụ | File | Ví dụ |
|---|---|---|---|
| Server state (API data) | React Query | `features/*/services/*.queries.js` | Danh sách phòng ban |
| Auth state | Zustand persist | `stores/auth-store.js` | Token, user, isAuthenticated |
| UI state | Zustand persist | `stores/ui-store.js` | sidebarOpen, theme |
| Form state | React Hook Form + Zod | `features/*/components/*.jsx` | Dữ liệu nhập form |

### 8.2. Zustand store

```js
// ✅ Tốt
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: ({ user, token }) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
    }),
    { name: 'fe-ats-auth', storage: createJSONStorage(() => localStorage) },
  ),
);
```

```js
// ❌ Tránh: dùng useState cho auth/global state
const [token, setToken] = useState(null); // KHÔNG cho auth
```

### 8.3. React Query — useQuery / useMutation

```js
// ✅ Tốt — Đặt trong feature/.../services/*.queries.js
export function useDepartmentList() {
  return useQuery({
    queryKey: DEPARTMENT_QUERY_KEYS.all,
    queryFn: () => departmentService.getList(),
  });
}

export function useCreateDepartment(options = {}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => departmentService.create(payload),
    onSuccess: () => {
      toast.success('Thêm mới thành công');
      queryClient.invalidateQueries({ queryKey: DEPARTMENT_QUERY_KEYS.all });
      options.onSuccess?.();
    },
    onError: (error) => toast.error(extractErrorMessage(error)),
    ...options,
  });
}
```

```js
// ❌ Tránh: gọi API trực tiếp trong component
const [data, setData] = useState([]);
useEffect(() => { fetch('/api/departments').then(setData); }, []); // KHÔNG
```

### 8.4. React Hook Form + Zod

```js
// ✅ Tốt — Schema riêng file
import { z } from 'zod';
export const loginSchema = z.object({
  username: z.string().min(1, 'Vui lòng nhập tên đăng nhập'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});
```

```jsx
// ✅ Tốt — Component
const { register, handleSubmit, reset, formState: { errors } } = useForm({
  resolver: zodResolver(schema),
  defaultValues: { departmentName: '', description: '' },
});

return (
  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <Input {...register('departmentName')} />
    {errors.departmentName && <p className="text-sm text-destructive">{errors.departmentName.message}</p>}
  </form>
);
```

## 9. API & HTTP

### 9.1. lib/http.js

Axios instance đã cấu hình:

```js
// http.interceptors.request — gắn Authorization header (hiện comment, bật khi BE có JWT)
// http.interceptors.response — unwrap response.data, xử lý 401 → redirect /login
```

```js
// ✅ Tốt — Dùng trong service
import { http } from '@/lib/http';

export const departmentService = {
  async getList() {
    return http.get(DEPARTMENT_ENDPOINTS.LIST);  // đã unwrap sẵn response.data
  },
  async create(data) {
    return http.post(DEPARTMENT_ENDPOINTS.CREATE, data);
  },
};
```

### 9.2. Cấu trúc endpoint

Endpoint được define ở `features/*/constants/index.js`. Không hardcode URL trong service hoặc component.

```js
export const DEPARTMENT_ENDPOINTS = {
  LIST:   '/api/departments',
  DETAIL: (id) => `/api/departments/${id}`,
  CREATE: '/api/departments',
  UPDATE: (id) => `/api/departments/${id}`,
  DELETE: '/api/departments',
};
```

| Phương thức | URL | Mục đích |
|---|---|---|
| GET | `/api/departments` | Danh sách |
| GET | `/api/departments/:id` | Chi tiết |
| POST | `/api/departments` | Tạo mới |
| PUT | `/api/departments/:id` | Cập nhật |
| DELETE | `/api/departments` (body: `{id}`) | Xóa |

### 9.3. Vite Proxy

`vite.config.js` cấu hình proxy: `/api/*` → `http://localhost:8080/api/*`. Không cần chỉ định full URL trong dev.

## 10. Routing

### 10.1. Định tuyến trong routes/

```
src/routes/
├── index.jsx            # AppRouter (BrowserRouter + Routes)
├── protected-route.jsx  # Redirect /login nếu chưa auth
├── public-routes.jsx    # Route công khai (/login)
└── private-routes.jsx   # Route cần đăng nhập
```

```jsx
// ✅ Tốt — dùng lazy() cho code splitting
const DepartmentList = lazy(() => import('@/features/departments/components/DepartmentList'));
const DepartmentForm = lazy(() => import('@/features/departments/components/DepartmentForm'));

export const privateRoutes = [
  { path: '/departments', element: <DepartmentList /> },
  { path: '/departments/new', element: <DepartmentForm /> },
  { path: '/departments/:id', element: <DepartmentForm /> },
];
```

### 10.2. Thêm route mới

1. Tạo component trong `features/<name>/components/`
2. Import lazy trong `routes/private-routes.jsx`
3. Thêm object vào `privateRoutes`
4. Thêm menu vào `configs/routes.js` (NAV_ITEMS)

## 11. Feature Architecture

### 11.1. Cấu trúc một feature

```
features/<name>/
├── components/          # Component UI (List, Form…)
├── services/
│   ├── <name>-service.js   # HTTP calls (axios)
│   └── <name>-queries.js   # React Query hooks
├── constants/index.js   # ENDPOINTS, ROUTES, QUERY_KEYS
├── types/index.js       # JSDoc typedef
└── index.js            # Barrel export
```

### 11.2. Quy tắc

- **Service** chỉ wrap HTTP, không logic toast/navigate.
- **Queries** chứa useQuery/useMutation + toast thành công/lỗi + invalidateQueries.
- **Component** chỉ gọi hook, render UI, gọi mutation.mutate().
- **Constants** chứa tất cả string/hardcode — sửa 1 chỗ, ảnh hưởng toàn bộ.
- **JSDoc typedef** định nghĩa shape của data (thay TypeScript).

## 12. Styling & UI

### 12.1. Tailwind CSS

- Dùng **utility class** của Tailwind, không viết CSS thuần trừ khi cần thiết.
- Dùng CSS variables của shadcn cho màu sắc (`text-primary`, `bg-destructive`, `text-muted-foreground`…).

```jsx
// ✅ Tốt
<Card className="p-4">
  <h1 className="text-2xl font-bold text-foreground">Tiêu đề</h1>
</Card>

// ❌ Tránh
<div style={{ padding: '1rem', backgroundColor: '#fff' }}>...</div>
```

### 12.2. cn() — merge className

```jsx
import { cn } from '@/lib/utils';

// ✅ Tốt — gộp className có điều kiện
<NavLink className={({ isActive }) =>
  cn('flex items-center gap-3', isActive && 'bg-primary text-primary-foreground')
}>
// ❌ Tránh
className={isActive ? 'bg-primary' : ''}
```

### 12.3. shadcn components

Thêm component mới:

```bash
npx shadcn@latest add <tên-component>
```

Components hiện có: `button`, `input`, `label`, `card`, `dialog`, `dropdown-menu`, `table`, `select`, `textarea`, `badge`, `separator`.

## 13. Authentication & Authorization

### 13.1. Auth state (Zustand)

```js
// stores/auth-store.js
// Lưu: user, token, refreshToken, isAuthenticated
// Persist vào localStorage với key 'fe-ats-auth'
```

```js
// ✅ Dùng hook useAuth() thay vì gọi store trực tiếp
import { useAuth } from '@/hooks/use-auth';
const { user, token, isAuthenticated, setAuth, clearAuth } = useAuth();
```

### 13.2. Route protection

```jsx
// ProtectedRoute tự động redirect /login nếu !isAuthenticated
// Logic trong routes/protected-route.jsx
```

### 13.3. Lưu ý JWT

Phần gắn `Authorization: Bearer <token>` trong `lib/http.js` **hiện đang comment**. Bật lại khi backend có AuthController + JWT:

```js
// src/lib/http.js — bỏ comment
const token = useAuthStore.getState().token;
if (token) {
  config.headers.Authorization = `Bearer ${token}`;
}
```

## 14. Error Handling

### 14.1. Lỗi API

```js
// ✅ Dùng extractErrorMessage()
import { extractErrorMessage } from '@/lib/extract-error';

toast.error(extractErrorMessage(error, 'Thao tác thất bại'));
```

### 14.2. Form validation

```js
// Zod handle validation tự động — errors object trả về từ formState
// Hiển thị: errors.fieldName.message
```

## 15. Environment Variables

- Prefix: `VITE_` (Vite convention)
- File: `.env` (dev), `.env.production` (prod)
- Truy cập: `import.meta.env.VITE_API_URL`

```env
VITE_API_URL=           # Rỗng = dùng relative path (proxy dev), hoặc full URL prod
```

## 16. Common Mistakes to Avoid

1. **Không gọi API trực tiếp trong component** — dùng React Query hook
2. **Không dùng useState cho auth/global state** — dùng Zustand
3. **Không hardcode URL/endpoint** — khai báo trong constants
4. **Không viết inline style** — dùng Tailwind class
5. **Không dùng default export cho component** — dùng named export hoặc default rõ ràng
6. **Không commit console.log** — xóa trước khi commit
7. **Không mutate response.data trực tiếp** — luôn parse/render từ data gốc

## 17. Scripts

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Dev server cổng 3000 |
| `npm run build` | Build production → `dist/` |
| `npm run preview` | Xem bản build |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |
