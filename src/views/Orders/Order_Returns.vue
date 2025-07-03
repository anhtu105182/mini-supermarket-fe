<template>
  <div class="orders-page">
    <h1 class="orders-title">Danh sách đơn trả hàng</h1>
    <div class="orders-table">
      <table>
        <thead>
          <tr>
            <th></th>
            <th><div class="skeleton-header"></div></th>
            <th><div class="skeleton-header"></div></th>
            <th><div class="skeleton-header"></div></th>
            <th><div class="skeleton-header"></div></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 3" :key="i">
            <td><div class="skeleton-row"></div></td>
            <td><div class="skeleton-row"></div></td>
            <td><div class="skeleton-row"></div></td>
            <td><div class="skeleton-row"></div></td>
            <td><div class="skeleton-row"></div></td>
          </tr>
        </tbody>
      </table>
      <div class="orders-empty">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
          alt="empty"
          class="orders-empty-img"
        />
        <div class="orders-empty-title">Quản lý danh sách đơn trả hàng</div>
        <div class="orders-empty-desc">
          Danh sách đơn được khách hàng trả lại bao gồm thông tin sản phẩm, tiền
          hoàn trả và tình trạng nhập kho
        </div>
        <!-- <button class="orders-add-btn">
          <i class="fa fa-plus-circle"></i> Thêm đơn hàng
        </button> -->
      </div>
    </div>
    <div class="orders-footer">
      Tìm hiểu về <a href="#" class="orders-link">đơn trả hàng</a>
    </div>
  </div>
</template>

<style scoped>
.orders-page {
  padding: 24px 16px 0 16px;
  background: #f7f7f9;
  min-height: 100vh;
}
.orders-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 18px;
  color: #222;
  margin-top: 0px;
}
.orders-table {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 24px 0 48px 0;
  min-height: 500px;
  position: relative;
}
table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-bottom: 32px;
}
th,
td {
  padding: 8px 0;
}
.skeleton-header {
  height: 18px;
  width: 120px;
  background: #f0f1f3;
  border-radius: 6px;
  opacity: 0.5;
}
.skeleton-row {
  height: 16px;
  width: 100px;
  background: #f0f1f3;
  border-radius: 6px;
  opacity: 0.3;
}
.orders-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.orders-empty-img {
  width: 72px;
  margin-bottom: 16px;
  opacity: 0.95;
}
.orders-empty-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 4px;
  color: #222;
  text-align: center;
}
.orders-empty-desc {
  color: #888;
  margin-bottom: 18px;
  text-align: center;
}
.orders-add-btn {
  background: #2196f3;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 22px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.08);
  transition: background 0.2s;
}
.orders-add-btn:hover {
  background: #1976d2;
}
.orders-footer {
  text-align: right;
  margin-top: 18px;
  color: #888;
  font-size: 0.97rem;
  display: flex;
  justify-content: center;
}
.orders-link {
  color: #2196f3;
  text-decoration: underline;
}
</style>
