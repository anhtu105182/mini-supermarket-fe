# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).



supermarket-app/
├── public/                            # Chứa các tài nguyên tĩnh
│   └── index.html                     # File HTML chính, nơi Vue mount vào (#app)
│
├── src/                               # Thư mục chứa toàn bộ mã nguồn frontend
│   ├── assets/                        # Ảnh, logo, font, file CSS tĩnh,...
│
│   ├── components/                    # Các component dùng lại nhiều lần trong nhiều view
│   │   ├── Header.vue                 # Thanh header (top navigation)
│   │   ├── Sidebar.vue               # Thanh sidebar (menu trái)
│   │   └── ProductTable.vue          # Bảng hiển thị danh sách sản phẩm
│
│   ├── layouts/                       # Các layout gốc (Auth, Dashboard, v.v.)
│   │   ├── DefaultLayout.vue         # Layout chính khi đã đăng nhập (có Header + Sidebar)
│   │   └── AuthLayout.vue            # Layout trang đăng nhập, đăng ký
│
│   ├── views/                         # Các trang chính tương ứng với từng route
│   │   ├── Dashboard.vue             # Trang tổng quan, thống kê
│   │   ├── Login.vue                 # Trang đăng nhập
│   │   ├── NotFound.vue             # Trang 404 khi không tìm thấy route
│   │   ├── Product/                  # Quản lý sản phẩm
│   │   │   ├── collections.vue       # Danh muc sản phẩm
│   │   │   ├── catalogs.vue          # ban gia  sản phẩm
│   │   │   ├── ProductList.vue       # Danh sách sản phẩm
│   │   │   └── ProductForm.vue       # Form thêm/sửa sản phẩm
│   │   ├── Inventory/                # Quản lý kho
│   │   │   ├── InventoryList.vue     # Danh sách tồn kho
│   │   │   └── StockReport.vue       # Báo cáo nhập/xuất kho
│   │   ├── Sales/                    # Quản lý bán hàng
│   │   │   └── SalesHistory.vue      # Lịch sử bán hàng
│   │   ├── Users/                    # Quản lý người dùng
│   │   │   ├── StaffList.vue         # Danh sách nhân viên
│   │   │   └── CustomerList.vue      # Danh sách khách hàng
│
│   ├── router/                        # Cấu hình định tuyến cho ứng dụng
│   │   └── index.js                  # Khai báo các route và middleware
│
│   ├── store/                         # Quản lý trạng thái toàn cục (Vuex hoặc Pinia)
│   │   └── index.js                  # Khởi tạo store chính
│
│   ├── services/                      # Gọi API backend, tổ chức theo chức năng
│   │   ├── productService.js         # API sản phẩm (CRUD sản phẩm)
│   │   ├── authService.js            # API xác thực (đăng nhập, đăng xuất)
│   │   ├── inventoryService.js       # API kho hàng
│   │   └── userService.js            # API người dùng (nhân viên, khách hàng)
│
│   ├── utils/                         # Các hàm tiện ích dùng chung
│   │   └── formatCurrency.js         # Hàm định dạng tiền (VD: 10,000₫)
│
│   ├── composables/                  # Logic dùng lại theo Composition API (Vue 3)
│   │   └── useAuth.js                # Composable để xử lý đăng nhập / kiểm tra login
│
│   ├── App.vue                       # Component gốc của toàn bộ app
│   ├── main.js                       # Điểm khởi tạo app, gắn Vue vào DOM, import router/store
│   └── style/                        # Các file CSS/SCSS tổng thể cho toàn app
│       └── main.css                  # File style chính (import vào App.vue hoặc main.js)
│
├── .env                              # Biến môi trường (VD: VITE_API_URL=http://localhost:3000)
├── vite.config.js                    # Cấu hình Vite (alias, plugin, server port, v.v.)
├── package.json                      # Danh sách dependencies, scripts, config project
└── README.md                         # Ghi chú mô tả cách chạy project, tính năng
