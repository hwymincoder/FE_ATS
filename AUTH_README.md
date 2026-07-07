# Authentication và Authorization

Tài liệu này mô tả luồng đăng nhập, cách lưu JWT, bảo vệ route và quy ước khai báo URL trong FE_ATS.

## 1. API đăng nhập

Endpoint đầy đủ:

```text
POST http://localhost:8080/api/auth/login
```

Form trên giao diện sử dụng `email` và `password`. `authService` chịu trách nhiệm đổi `password` thành `hashPassword` theo contract của backend.

Request:

```json
{
  "email": "interviewer@ats.local",
  "hashPassword": "123456"
}
```

Response:

```json
{
  "message": "Login successful",
  "accessToken": "<jwt>",
  "user": {
    "id": 4,
    "username": "interviewer@ats.local",
    "fullName": "Interview One",
    "role": "INTERVIEWER"
  }
}
```

Không tự hash mật khẩu tại frontend nếu backend không quy định thuật toán riêng. Mật khẩu phải được truyền qua HTTPS ở môi trường production.

## 2. Luồng đăng nhập hiện tại

```text
Login form
  -> loginSchema kiểm tra email/password
  -> authService map password thành hashPassword
  -> POST /auth/login
  -> Zustand lưu user/accessToken
  -> chuyển về URL trước khi login hoặc Dashboard
```

Các file chính:

| File | Trách nhiệm |
|---|---|
| `src/pages/auth/login.jsx` | Form và điều hướng sau đăng nhập |
| `src/schemas/login-schema.js` | Validate email/password |
| `src/services/auth-service.js` | Gọi API auth và map request |
| `src/stores/auth-store.js` | Lưu `user` và `accessToken` |
| `src/hooks/use-auth.js` | API dùng auth state trong component |
| `src/lib/http.js` | Gắn Bearer token và xử lý HTTP 401 |
| `src/routes/protected-route.jsx` | Chặn trang yêu cầu đăng nhập |

## 3. Zustand auth store

State được persist trong localStorage với key `fe-ats-auth`:

```js
{
  user: null,
  accessToken: null
}
```

Trạng thái đăng nhập được suy ra từ token:

```js
const isAuthenticated = Boolean(accessToken);
```

Không lưu riêng `isAuthenticated`, tránh trường hợp token bị xóa hoặc hết hạn nhưng cờ đăng nhập vẫn là `true`.

Trong React component, sử dụng hook:

```js
const {
  user,
  accessToken,
  isAuthenticated,
  setAuth,
  clearAuth,
} = useAuth();
```

Trong interceptor hoặc code nằm ngoài React component:

```js
const accessToken = useAuthStore.getState().accessToken;
```

Feature service không được tự đọc/ghi localStorage và không tự gắn token.

## 4. Axios interceptor

`src/lib/http.js` tự động thêm header cho mọi request sau khi đăng nhập:

```http
Authorization: Bearer <accessToken>
```

Khi backend trả:

- `401 Unauthorized`: xóa auth state và chuyển về `/login`.
- `403 Forbidden`: không xóa đăng nhập; UI nên chuyển tới trang `/forbidden`.

Backend hiện chưa trả refresh token nên FE chưa triển khai refresh-token flow.

## 5. Quy ước URL API

`.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

Do base URL đã chứa `/api`, endpoint trong source không được lặp lại `/api`:

```js
// Đúng
const ENDPOINTS = {
  LIST: '/departments',
  DETAIL: (id) => `/departments/${id}`,
};

// Sai: tạo thành /api/api/departments
const ENDPOINTS = {
  LIST: '/api/departments',
};
```

Endpoint của từng feature đặt tại:

```text
src/pages/<feature>/constants/
```

Endpoint auth dùng chung đặt tại:

```text
src/constants/api-endpoints.js
```

## 6. Các loại route

| Loại | Ví dụ | Cách xử lý |
|---|---|---|
| Public | `/jobs`, `/jobs/:id` | Không bọc guard |
| Guest-only | `/login` | Có thể dùng `GuestRoute` |
| Private | `/dashboard`, `/profile` | Bọc `ProtectedRoute` |
| Restricted | `/departments` | `ProtectedRoute` và kiểm tra role |

`privateRoutes` là danh sách cấu hình những trang nội bộ. `ProtectedRoute` là component thực hiện kiểm tra đăng nhập.

```text
privateRoutes = danh sách cửa cần khóa
ProtectedRoute = ổ khóa
```

### Public route

Khai báo trong `src/routes/public-routes.jsx` và render ngoài `ProtectedRoute`:

```jsx
export const publicRoutes = [
  {
    path: '/jobs',
    element: <JobList />,
  },
];
```

Lưu ý: route `/login` hiện cũng nằm trong file này nhưng được đặt trong `AuthLayout`. Nếu muốn ngăn người đã đăng nhập quay lại `/login`, có thể tách login sang `guest-routes.jsx` và thêm `GuestRoute`.

### Private route

Khai báo trong `src/routes/private-routes.jsx`:

```jsx
export const privateRoutes = [
  {
    path: '/interviews',
    element: <InterviewsPage />,
  },
];
```

Router đang bọc toàn bộ nhóm này bằng:

```jsx
<ProtectedRoute>
  <MainLayout />
</ProtectedRoute>
```

Nếu không có `accessToken`, `ProtectedRoute` chuyển người dùng tới `/login` và lưu URL cũ trong `location.state.from`.

## 7. Phân quyền theo role

Response backend hiện cung cấp:

```js
user.role === 'INTERVIEWER'
```

FE nên sử dụng đúng giá trị trong `user.role`. Không dùng claim `ROLE_INTERVIEWER` trong JWT để render UI nếu response user đã cung cấp role chuẩn hóa.

Khai báo role:

```js
export const ROLES = {
  ADMIN: 'ADMIN',
  RECRUITER: 'RECRUITER',
  INTERVIEWER: 'INTERVIEWER',
};
```

Chỉ thêm role thực sự tồn tại ở backend.

Quyền truy cập được khai báo tập trung trong `src/configs/routes.js`:

```js
export const ROUTE_ACCESS = {
  DEPARTMENTS: [ROLES.ADMIN],
  INTERVIEWS: [ROLES.ADMIN, ROLES.INTERVIEWER],
};
```

Route sử dụng lại cấu hình này:

```jsx
{
  path: '/interviews',
  element: <InterviewsPage />,
  allowedRoles: ROUTE_ACCESS.INTERVIEWS,
}
```

`RoleRoute` đã được triển khai tại `src/routes/role-route.jsx`:

```jsx
import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/configs/routes';
import { useAuth } from '@/hooks/use-auth';
import { hasAllowedRole } from '@/lib/authorization';

export default function RoleRoute({ allowedRoles, children }) {
  const { user } = useAuth();

  if (!hasAllowedRole(user?.role, allowedRoles)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children;
}
```

Áp dụng khi render private route:

```jsx
<RoleRoute allowedRoles={route.allowedRoles}>
  {route.element}
</RoleRoute>
```

Quy tắc hiện tại:

| Route | Role được phép |
|---|---|
| `/` | Mọi tài khoản đã đăng nhập |
| `/departments` | `ADMIN` |
| `/interviews` | `ADMIN`, `INTERVIEWER` |
| `/forbidden` | Mọi tài khoản đã đăng nhập |

Sidebar dùng cùng `ROUTE_ACCESS` và tự ẩn menu mà người dùng không có quyền truy cập.

Phân quyền frontend chỉ phục vụ điều hướng và trải nghiệm người dùng. Backend vẫn phải kiểm tra quyền cho mọi API và trả `403` khi người dùng không có quyền.

## 8. Thêm một trang mới

Ví dụ thêm Candidates:

```text
src/pages/candidates/
├── index.jsx
├── components/
├── hooks/
├── services/
└── constants/
    ├── candidate.constants.js
    └── index.js
```

### Khai báo API và page route

```js
export const CANDIDATE_ENDPOINTS = {
  LIST: '/candidates',
  DETAIL: (id) => `/candidates/${id}`,
  CREATE: '/candidates',
};

export const CANDIDATE_ROUTES = {
  LIST: '/candidates',
  DETAIL: (id) => `/candidates/${id}`,
};
```

- `ENDPOINTS`: URL gọi backend.
- `ROUTES`: URL hiển thị trên trình duyệt.

### Viết service

```js
export const candidateService = {
  getList(params) {
    return http.get(CANDIDATE_ENDPOINTS.LIST, { params });
  },
};
```

### Đăng ký trang

- Trang ai cũng xem được: thêm vào `public-routes.jsx`.
- Trang cần đăng nhập: thêm vào `private-routes.jsx`.
- Trang cần role: thêm `allowedRoles` và bọc bằng `RoleRoute`.
- Nếu cần hiển thị trong sidebar: thêm menu vào `src/configs/routes.js` và lọc menu theo `user.role`.

## 9. Đăng xuất

Với backend không yêu cầu thu hồi token:

```js
clearAuth();
navigate('/login', { replace: true });
```

Nếu backend có endpoint logout:

```js
try {
  await authService.logout();
} finally {
  clearAuth();
  navigate('/login', { replace: true });
}
```

`finally` bảo đảm FE vẫn xóa session khi API logout lỗi hoặc token đã hết hạn.

## 10. Lưu ý bảo mật

Access token hiện được persist trong localStorage. Cách này đơn giản nhưng token có thể bị đọc nếu ứng dụng gặp lỗ hổng XSS.

Phương án production an toàn hơn:

- Refresh token nằm trong cookie `HttpOnly`, `Secure`, `SameSite`.
- Access token chỉ giữ trong memory.
- Khi reload trang, gọi endpoint refresh để lấy access token mới.

Để dùng phương án này, backend cần bổ sung refresh-token API và cookie flow.
