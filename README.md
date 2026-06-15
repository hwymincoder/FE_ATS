# FE_ATS — Frontend Application Tracking System

## Giới thiệu

Frontend của hệ thống ATS — quản lý phòng ban, ứng viên, tin tuyển dụng…

```
ATS_WEB/
├── FE_ATS/    ← Frontend (React) — cổng 3000
└── BE_ATS/    ← Backend (Spring Boot) — cổng 8080
```

## Tech Stack

| Lớp | Công nghệ | Chức năng |
|---|---|---|
| Build | **Vite 5** | Dev server + build production |
| UI | **React 18** | Giao diện component |
| Style | **Tailwind CSS 3** + **shadcn/ui** | CSS utility class + component sẵn |
| Routing | **react-router-dom v6** | Chuyển trang (SPA) |
| Server state | **@tanstack/react-query v5** | Gọi API, cache, loading |
| Client state | **Zustand v5** | Auth, theme, UI state |
| Form | **react-hook-form + Zod** | Nhập liệu + kiểm tra dữ liệu |
| HTTP | **axios** | Gửi request đến backend |
| Toast | **sonner** | Thông báo góc phải màn hình |
| Icons | **lucide-react** | Icon SVG |

## Cài đặt & Chạy

### Yêu cầu
- Node.js >= 18
- npm (hoặc yarn/pnpm)

### Cài dependencies
```bash
npm install
```

### Chạy dev server
```bash
npm run dev
# Mở trình duyệt: http://localhost:3000
```

Backend phải chạy ở **cổng 8080**. Vite tự proxy `/api/*` sang backend.

### Các lệnh khác

| Lệnh | Mô tả |
|---|---|
| `npm run dev` | Dev server cổng 3000 |
| `npm run build` | Build production → thư mục `dist/` |
| `npm run preview` | Xem bản build |
| `npm run lint` | Kiểm tra lỗi ESLint |
| `npm run format` | Format code tự động (Prettier) |

## Cấu trúc thư mục

```
src/
├── assets/                 # Ảnh, logo
├── components/
│   ├── ui/                 # shadcn components (button, card, dialog…)
│   └── shared/             # ConfirmDialog, PageHeader, Loading
├── configs/
│   └── routes.js           # NAV_ITEMS cho sidebar
├── constants/
│   ├── index.js             # APP_NAME, ROLES, STORAGE_KEYS
│   └── api-endpoints.js     # API endpoint tập trung
├── pages/                  # Chia theo nghiệp vụ
│   ├── auth/              # Login page
│   ├── dashboard/         # Dashboard page
│   └── departments/      # VD: trang phòng ban
│       ├── components/    # DepartmentList, DepartmentForm
│       ├── services/     # Gọi API + React Query hooks
│       ├── constants/     # Endpoint, route, query key
│       └── types/        # JSDoc typedef
├── hooks/                  # Custom hooks (useAuth, useDebounce…)
├── layouts/
│   ├── auth-layout.jsx     # Layout /login
│   └── main-layout.jsx     # Sidebar + Header + nội dung
├── lib/
│   ├── utils.js            # cn() — gộp className
│   ├── http.js            # Axios instance + interceptors
│   └── extract-error.js   # Lấy message lỗi
pages/auth/
├── routes/                 # Protected, public, private routes
├── schemas/               # Zod schema (validate form)
├── services/             # Gọi API (auth)
├── stores/               # Zustand (auth-store, ui-store)
├── styles/
│   └── globals.css        # Tailwind + CSS variables
├── App.jsx               # Provider stack
└── main.jsx              # createRoot — điểm khởi đầu
```

## Luồng hoạt động

```
main.jsx
  └─ App.jsx               (QueryClient + Toaster + Router)
       └─ AppRouter
            ├─ /login      → AuthLayout → Login
            └─ /*          → ProtectedRoute → MainLayout
                                            ├─ Sidebar
                                            ├─ Header
                                            └─ <Outlet/> → trang nghiệp vụ
```

## Cấu trúc một trang (ví dụ: departments)

```
pages/departments/
├── components/          # UI: DepartmentList, DepartmentForm
├── services/
│   ├── department-service.js   # Gọi HTTP (axios)
│   └── department-queries.js   # useQuery / useMutation
├── constants/          # Endpoint, route, query key
└── index.js           # Barrel export
```

**Quy tắc:** Endpoint route define ở `constants/` — không hardcode URL rải rác.

## Phân chia state

| Loại | Công cụ | Dùng khi nào |
|---|---|---|
| Dữ liệu từ API | React Query | Lấy danh sách, chi tiết, thêm/sửa/xóa |
| Auth / Theme | Zustand | Token, user, sidebar state |
| Form input | React Hook Form + Zod | Validate dữ liệu nhập |
| HTTP | axios | Gửi request, gắn token |

## Cách gọi API

`lib/http.js` là axios instance đã cấu hình sẵn:

```js
import { http } from '@/lib/http';

// Tất cả response đã unwrap sẵn — chỉ cần return
const res = await http.get('/api/departments');
```

**Proxy (vite.config.js):** `/api/*` → `http://localhost:8080/api/*`

## Cách thêm trang mới

VD: thêm trang **candidates**

```
1. Tạo: src/pages/candidates/
   ├── components/   (CandidateList, CandidateForm)
   ├── services/     (candidates-service.js, candidates-queries.js)
   ├── constants/
   └── index.js

2. Định nghĩa endpoint + route + query key trong constants/

3. Viết service → queries → components

4. Thêm route trong routes/private-routes.jsx

5. Thêm menu vào configs/routes.js (NAV_ITEMS)
```

## Cách thêm shadcn component

```bash
npx shadcn@latest add <tên-component>

# Ví dụ
npx shadcn@latest add popover
```

Components hiện có: `button`, `input`, `label`, `card`, `dialog`, `dropdown-menu`, `table`, `select`, `textarea`, `badge`, `separator`.

## Tùy biến giao diện

Màu sắc + CSS variables nằm trong `src/styles/globals.css`. Đổi ở đây → ảnh hưởng toàn app.

## Lỗi thường gặp

| Lỗi | Cách xử lý |
|---|---|
| CORS | Backend `CorsConfig` phải cho phép `http://localhost:3000` |
| `/api` 404 | Backend chưa chạy ở cổng 8080 |
| Redirect về /login | Chưa đăng nhập hoặc token hết hạn |
| Không thấy dữ liệu sau CRUD | Kiểm tra `invalidateQueries` trong mutation |
| ESLint báo lỗi | Chạy `npm run format` rồi `npm run lint` |

## Build production

```bash
npm run build        # Tạo dist/
npm run preview      # Xem thử bản build
```

FE + BE cùng domain → để `VITE_API_URL` rỗng (relative path).
FE + BE khác domain → tạo `.env.production`:
```
VITE_API_URL=https://api.your-domain.com
```

---

MIT — ATS_WEB
