import { createRouter, createWebHistory } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue"; // layout cho các trang đăng nhập, đăng ký
import LoginPage from "@/views/LoginPage.vue"; // trang đăng nhập
import RegisterPage from "@/views/RegisterPage.vue"; // trang đăng ký
import DashboardOverview from "@/views/DashboardOverview.vue"; // trang chủ dashboard
import AppLayout from "@/layouts/AppLayout.vue"; // layout cho các trang ứng dụng chính
// import các trang Product
import Catalogs from "@/views/Product/Catalogs.vue"; // bảng giá
import ProductList from "@/views/Product/ProductList.vue"; // danh sách sản phẩm
import Collections from "@/views/Product/Collections.vue"; // danh mục sản phẩm

// import các trang Inventory
import Inventories from "@/views/Inventory/Inventories.vue"; // danh sách tồn kho
import Purchase_orders from "@/views/Inventory/Purchase_orders.vue"; // Danh sách đơn đặt hàng nhập
import Receive_inventories from "@/views/Inventory/Receive_inventories.vue"; // Danh sách đơn nhập hàng
import Stock_transfers from "@/views/Inventory/Stock_transfers.vue"; // chuyển kho
import Supplier_returns from "@/views/Inventory/Supplier_returns.vue"; // trả hàng nhập
import Suppliers from "@/views/Inventory/Suppliers.vue"; // nhà cung cấp

// import các trang Oders
import Orders from "@/views/Orders/Orders.vue"; // danh sách đơn hàng
import Draft_Orders from "@/views/Orders/Draft_Orders.vue"; // đơn hàng nháp
import Order_Returns from "@/views/Orders/Order_Returns.vue"; // trả hàng
import Checkouts from "@/views/Orders/Checkouts.vue"; // đơn hàng chưa hoàn tất

// các trang sales
import Discounts from "@/views/Sales/Discounts.vue"; // giảm giá

// import các trang vận chuyển
import Shipments from "@/views/Shipments/Shipments.vue"; // danh sách vận chuyển
import Reports_Shipments from "@/views/Shipments/Reports_Shipments.vue"; // báo cáo tổng quan

// import các người dùng
import CustomerList from "@/views/Users/CustomerList.vue"; // danh sách khách hàng
import Customer_groups from "@/views/Users/Customer_groups.vue"; // nhóm khách hàng

// import reports
import Reports_list from "@/views/Reports/Reports_list.vue"; // danh sách báo cáo
import Reports from "@/views/Reports/Reports.vue"; // báo cáo tổng quan

const routes = [
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: { name: "DashboardOverview" },
      },
      {
        path: "dashboard",
        name: "DashboardOverview",
        component: DashboardOverview,
      },
      {
        path: "products",
        name: "ProductCollections",
        component: ProductList,
      },
      {
        path: "catalogs",
        name: "Catalogs",
        component: Catalogs,
      },
      {
        path: "collections",
        name: "Collections",
        component: Collections,
      },
      {
        path: "inventories",
        name: "Inventories",
        component: Inventories,
      },
      {
        path: "purchase-orders",
        name: "PurchaseOrders",
        component: Purchase_orders,
      },
      {
        path: "receive-inventories",
        name: "ReceiveInventories",
        component: Receive_inventories,
      },
      {
        path: "stock-transfers",
        name: "StockTransfers",
        component: Stock_transfers,
      },
      {
        path: "supplier-returns",
        name: "SupplierReturns",
        component: Supplier_returns,
      },
      {
        path: "suppliers",
        name: "Suppliers",
        component: Suppliers,
      },
      {
        path: "orders",
        name: "Orders",
        component: Orders,
      },
      {
        path: "draft-orders",
        name: "DraftOrders",
        component: Draft_Orders,
      },
      {
        path: "order-returns",
        name: "OrderReturns",
        component: Order_Returns,
      },
      {
        path: "checkouts",
        name: "Checkouts",
        component: Checkouts,
      },
      {
        path: "discounts",
        name: "Discounts",
        component: Discounts,
      },
      {
        path: "shipments",
        name: "Shipments",
        component: Shipments,
      },
      {
        path: "reports",
        name: "Reports",
        component: Reports,
      },
      {
        path: "customer-list",
        name: "CustomerList",
        component: CustomerList,
      },
      {
        path: "customer-groups",
        name: "CustomerGroups",
        component: Customer_groups,
      },
      {
        path: "reports-list",
        name: "ReportsList",
        component: Reports_list,
      },
      {
        path: "reports-shipments",
        name: "Reports-Shipments",
        component: Reports - Shipments,
      },
      // Thêm các route con khác nếu cần
    ],
  },
  {
    path: "/login",
    component: AuthLayout,
    children: [
      {
        path: "",
        name: "Login",
        component: LoginPage,
      },
    ],
  },
  {
    path: "/register",
    component: AuthLayout,
    children: [
      {
        path: "",
        component: RegisterPage,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
