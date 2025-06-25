<!-- src/components/Sidebar.vue -->
<template>
  <nav class="sidebar">
    <ul>
      <li>
        <router-link to="/dashboard">Trang chủ</router-link>
      </li>
      <li>
        <router-link to="/products">Sản Phẩm</router-link>
      </li>
      <li>
        <router-link to="/inventory">Hàng tồn kho</router-link>
      </li>
      <li>
        <router-link to="/sales">Bán hàng</router-link>
      </li>
      <li>
        <router-link to="/users/staff">Nhân viên</router-link>
      </li>
      <li>
        <router-link to="/users/customers">Khách hàng</router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "AppSidebar",
};
// console.log('AppSidebar component loaded');
</script>

<style scoped>
.sidebar {
  /* position: fixed; */
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background: linear-gradient(135deg, #34495e 80%, #2c3e50 100%);
  color: #fff;
  padding: 30px 20px;
  /* border-top-right-radius: 18px; */
  border-bottom-right-radius: 18px;
  box-shadow: 2px 0 16px rgba(44, 62, 80, 0.12);
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

li {
  margin-bottom: 18px;
  width: 100%;
}

a {
  display: block;
  color: #fff;
  text-decoration: none;
  font-size: 1.08rem;
  padding: 10px 16px;
  border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}

a.router-link-exact-active,
a:hover {
  background: #3498db;
  color: #fff;
}
</style>
