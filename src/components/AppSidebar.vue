<!-- src/components/Sidebar.vue -->
<template>
  <nav class="sidebar">
    <div class="sidebar-logo">MiniMarkit</div>
    <ul class="sidebar-menu">
      <li>
        <router-link to="/dashboard"
          ><span class="icon">🏠</span> Tổng quan</router-link
        >
      </li>
      <li>
        <router-link to="/orders"
          ><span class="icon">🧾</span> Đơn hàng</router-link
        >
      </li>
      <li>
        <router-link to="/orders/list"
          ><span class="icon">📋</span> Danh sách đơn hàng</router-link
        >
      </li>
      <li>
        <router-link to="/orders/draft"
          ><span class="icon">📝</span> Đơn hàng nháp</router-link
        >
      </li>
      <li>
        <router-link to="/orders/return"
          ><span class="icon">↩️</span> Trả hàng</router-link
        >
      </li>
      <li>
        <router-link to="/orders/incomplete"
          ><span class="icon">⏳</span> Đơn chưa hoàn tất</router-link
        >
      </li>
      <li>
        <router-link to="/shipping"
          ><span class="icon">🚚</span> Vận chuyển</router-link
        >
      </li>
      <li>
        <router-link to="/products"
          ><span class="icon">📦</span> Sản phẩm</router-link
        >
      </li>
      <li>
        <router-link to="/inventory"
          ><span class="icon">🏠</span> Quản lý kho</router-link
        >
      </li>
      <li>
        <router-link to="/inventory/stock"
          ><span class="icon">📊</span> Tồn kho</router-link
        >
      </li>
      <li>
        <router-link to="/inventory/order"
          ><span class="icon">🛒</span> Đặt hàng nhập</router-link
        >
      </li>
      <li>
        <router-link to="/inventory/receive"
          ><span class="icon">📥</span> Nhập hàng</router-link
        >
      </li>
      <li>
        <router-link to="/inventory/return"
          ><span class="icon">↩️</span> Trả hàng nhập</router-link
        >
      </li>
      <li>
        <router-link to="/inventory/transfer"
          ><span class="icon">🔄</span> Chuyển kho</router-link
        >
      </li>
      <li>
        <router-link to="/suppliers"
          ><span class="icon">🏭</span> Nhà cung cấp</router-link
        >
      </li>
      <li>
        <router-link to="/customers"
          ><span class="icon">👤</span> Khách hàng</router-link
        >
      </li>
      <li>
        <router-link to="/promotion"
          ><span class="icon">🎁</span> Khuyến mại</router-link
        >
      </li>
      <li>
        <router-link to="/fund"
          ><span class="icon">💰</span> Sổ quỹ</router-link
        >
      </li>
      <li>
        <router-link to="/report"
          ><span class="icon">📈</span> Báo cáo</router-link
        >
      </li>
      <li>
        <router-link to="/settings"
          ><span class="icon">⚙️</span> Cấu hình</router-link
        >
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "AppSidebar",
};
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: #19223a;
  color: #fff;
  padding: 0 0 20px 0;
  box-shadow: 2px 0 16px rgba(44, 62, 80, 0.12);
  z-index: 100;
  display: flex;
  flex-direction: column;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.sidebar-logo {
  font-size: 1.4rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: #fff;
  padding: 13px 0 18px 28px;
  margin-bottom: 8px;
  background: none;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 101;
  background: #19223a;
  border-bottom: 1px solid #eaf0f5;
}

.sidebar-menu {
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  width: 100%;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

li {
  width: 100%;
  margin-bottom: 2px;
}

.router-link-exact-active,
.router-link-active {
  background: #2c3e50 !important;
  color: #fff !important;
}

.router-link-exact-active .icon,
.router-link-active .icon {
  color: #fff;
}

a {
  display: flex;
  align-items: center;
  color: #bfc9da;
  text-decoration: none;
  font-size: 0.9rem;
  padding: 12px 28px;
  /* border-radius: 8px; */
  transition: background 0.2s, color 0.2s;
  gap: 12px;
}

a:hover {
  background: #22305a;
  color: #fff;
}

.icon {
  font-size: 1.25rem;
  min-width: 22px;
  text-align: center;
  color: #bfc9da;
}

::-webkit-scrollbar {
  width: 6px;
  background: #22305a;
}
::-webkit-scrollbar-thumb {
  background: #2c3e50;
  border-radius: 4px;
}
</style>
