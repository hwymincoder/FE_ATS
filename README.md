# FE_ATS - Frontend Base Framework

Framework frontend xây dựng theo pattern từ **MBF_BHTT_Framework**.

## Cấu trúc

```
src/
├── components/
│   └── FTUComponent.js          # Base class cho mọi container/page
├── constants/
│   ├── AppPath.js               # API endpoints
│   ├── AppProps.js              # Props keys
│   └── Constants.js             # Hằng số dùng chung
├── containers/
│   ├── Dashboard.jsx            # Trang chủ
│   ├── Login.jsx                # Đăng nhập
│   └── category/goods/          # Module mẫu
├── layouts/
│   ├── MainLayout.jsx           # Layout chính (sidebar + header)
│   └── LoginLayout.jsx          # Layout trang login
├── locales/
│   ├── vi.json                  # Tiếng Việt
│   └── en.json                  # English
├── routes/
│   └── AppRouter.jsx           # Routing với lazy loading
├── services/
│   └── apiClient.js             # Axios wrapper + BaseService
├── stores/
│   ├── store.js                 # Redux store
│   └── actions.js               # Redux actions
└── utils/
    └── commonUtils.js           # Hàm utility dùng chung
```

## Cách tạo container mới

```bash
# Tạo folder theo domain
src/containers/category/goods/

# Kế thừa FTUComponent thay vì React.Component
import { FTUComponent } from 'components/FTUComponent.js';

class GoodsList extends FTUComponent {
  state = {
    data: [],
    loading: false,
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
      this.showError('Lỗi tải dữ liệu');
    } finally {
      this.setState({ loading: false });
    }
  };
}
```

## Cách tạo service mới

```bash
# Tạo file trong services/
src/services/category/goodsService.js

import { BaseService } from './apiClient.js';

class GoodsService extends BaseService {
  constructor() {
    super('/goods');
  }

  getByCategory(categoryId) {
    return apiClient.get(`/goods/category/${categoryId}`);
  }
}

export const goodsService = new GoodsService();
```

## Chạy project

```bash
npm install
npm run dev
```

## Pattern quan trọng từ MBF

1. **FTUComponent** - Base class chứa tất cả helpers dùng chung
2. **BaseService** - CRUD base cho mọi service
3. **Domain-based folder** - Tổ chức theo domain (category, inventory, sale...)
4. **Lazy loading** - Import page với lazy() để code splitting
5. **i18n** - Translation với i18next
