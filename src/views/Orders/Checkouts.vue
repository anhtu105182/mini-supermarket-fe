<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Đơn chưa hoàn tất</h1>
      <el-button :icon="Message" @click="sendMassEmail">
        Gửi email hàng loạt
      </el-button>
    </div>

    <div class="table-container">
      <div class="filters-bar">
        <div class="search-input-wrapper">
          <el-input
            v-model="search"
            placeholder="Tìm theo mã đơn, tên hoặc email khách..."
            clearable
            :prefix-icon="Search"
          />
        </div>
        <el-select
          v-if="!isMobile"
          v-model="statusFilter"
          placeholder="Trạng thái"
          clearable
        >
          <el-option label="Chưa liên hệ" value="Chưa liên hệ"></el-option>
          <el-option label="Đã gửi email" value="Đã gửi email"></el-option>
        </el-select>
      </div>

      <el-table
        v-if="!isMobile"
        :data="pagedCheckouts"
        v-loading="isLoading"
        style="width: 100%"
      >
        <el-table-column prop="checkoutCode" label="Mã đơn" width="120" />
        <el-table-column label="Khách hàng" min-width="200">
          <template #default="scope">
            <div class="customer-cell">
              <div>{{ scope.row.customerName }}</div>
              <div class="customer-contact">
                {{ scope.row.customerContact }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdDate" label="Thời gian tạo" width="160" />
        <el-table-column label="Giá trị" width="150" align="right">
          <template #default="scope">
            <span class="total-amount">{{
              formatCurrency(scope.row.totalAmount)
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Trạng thái" width="150" align="center">
          <template #default="scope">
            <el-tag
              :type="getStatusType(scope.row.status)"
              effect="light"
              size="small"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Thao tác" width="120" align="center">
          <div class="action-buttons">
            <el-tooltip content="Xem chi tiết" placement="top">
              <el-button size="small" :icon="View" circle />
            </el-tooltip>
            <el-tooltip content="Gửi link thanh toán" placement="top">
              <el-button size="small" :icon="Promotion" type="primary" circle />
            </el-tooltip>
          </div>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-card-list">
        <div
          v-for="item in pagedCheckouts"
          :key="item.checkoutCode"
          class="mobile-card"
        >
          <div class="card-header">
            <div class="card-title-group">
              <span class="card-title">{{ item.customerName }}</span>
              <span class="card-subtitle">{{ item.customerContact }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">Mã đơn</span>
              <span class="card-value">{{ item.checkoutCode }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Thời gian</span>
              <span class="card-value">{{ item.createdDate }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Giá trị</span>
              <span class="card-value total-amount">{{
                formatCurrency(item.totalAmount)
              }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Trạng thái</span>
              <span class="card-value">
                <el-tag
                  :type="getStatusType(item.status)"
                  effect="light"
                  size="small"
                  >{{ item.status }}</el-tag
                >
              </span>
            </div>
          </div>
          <div class="card-footer">
            <el-button size="small" :icon="View" text bg>Xem</el-button>
            <el-button size="small" :icon="Promotion" type="primary" plain
              >Gửi Link</el-button
            >
          </div>
        </div>
      </div>

      <el-empty v-if="!isLoading && pagedCheckouts.length === 0">
        <template #description>
          <div class="orders-empty-title">
            Cửa hàng của bạn chưa có đơn chưa hoàn tất nào.
          </div>
          <p class="orders-empty-desc">
            Hệ thống tự động ghi nhận lại thông tin khi khách hàng đã đến trang
            thanh toán nhưng chưa hoàn tất.
          </p>
        </template>
      </el-empty>
    </div>

    <div class="pagination-container">
      <el-pagination
        v-if="filteredCheckouts.length > 0"
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredCheckouts.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Search, Message, View, Promotion } from "@element-plus/icons-vue";

// --- STATE ---
const isMobile = ref(false);
const isLoading = ref(true);
const search = ref("");
const statusFilter = ref("");
const currentPage = ref(1);
const pageSize = 10;
const checkouts = ref([]);

// --- DỮ LIỆU MẪU ---
const sampleCheckouts = [
  {
    checkoutCode: "CK105",
    customerName: "Khách vãng lai",
    customerContact: "0905******",
    createdDate: "2025-08-08 10:32",
    totalAmount: 450000,
    status: "Chưa liên hệ",
  },
  {
    checkoutCode: "CK104",
    customerName: "Trần Thị Bích",
    customerContact: "bich.tt@example.com",
    createdDate: "2025-08-07 22:15",
    totalAmount: 120000,
    status: "Đã gửi email",
  },
  {
    checkoutCode: "CK103",
    customerName: "Lê Hoàng Cường",
    customerContact: "0987******",
    createdDate: "2025-08-07 14:00",
    totalAmount: 980000,
    status: "Chưa liên hệ",
  },
  {
    checkoutCode: "CK102",
    customerName: "Phạm Mỹ Duyên",
    customerContact: "duyen.pm@example.com",
    createdDate: "2025-08-06 11:40",
    totalAmount: 325000,
    status: "Đã gửi email",
  },
];

// --- LOGIC ---
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};
const formatCurrency = (value) => value.toLocaleString("vi-VN") + "đ";
const getStatusType = (status) =>
  status === "Đã gửi email" ? "success" : "warning";

const filteredCheckouts = computed(() => {
  return checkouts.value.filter((item) => {
    const searchMatch = search.value
      ? item.checkoutCode.toLowerCase().includes(search.value.toLowerCase()) ||
        item.customerName.toLowerCase().includes(search.value.toLowerCase()) ||
        item.customerContact.toLowerCase().includes(search.value.toLowerCase())
      : true;
    const statusMatch = statusFilter.value
      ? item.status === statusFilter.value
      : true;
    return searchMatch && statusMatch;
  });
});

const pagedCheckouts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredCheckouts.value.slice(start, start + pageSize);
});

const sendMassEmail = () => {};
watch([search, statusFilter], () => {
  currentPage.value = 1;
});

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  setTimeout(() => {
    checkouts.value = sampleCheckouts;
    isLoading.value = false;
  }, 500);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>
/* @import './responsive-style.css'; Sử dụng file CSS chung */

/* === SỬA ĐỔI: CSS cho bộ lọc và cột thao tác === */
.filters-bar {
  display: flex;
  gap: 16px;
  justify-content: space-between;
}
.search-input-wrapper {
  flex-grow: 1; /* Cho phép ô input co giãn */
}
/* ============================================== */

.total-amount {
  font-weight: 600;
  color: #1f2937;
}
.customer-cell {
  font-weight: 500;
}
.customer-contact {
  font-size: 0.8rem;
  color: #6b7280;
}
.orders-empty-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
}
.orders-empty-desc {
  font-size: 0.9rem;
  color: #6b7280;
  max-width: 400px;
  margin-top: 8px;
  line-height: 1.5;
}
.card-title-group {
  display: flex;
  flex-direction: column;
}
.card-subtitle {
  font-size: 0.8rem;
  color: #6b7280;
  font-weight: 400;
  margin-top: 2px;
}
.mobile-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

/* ----- GLOBAL LAYOUT & TYPOGRAPHY ----- */
.page-container {
  padding: 16px;
  background-color: #f9fafb;
  font-family: "Inter", sans-serif;
  min-height: 100vh;
}
.page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}
.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

/* ----- CONTAINERS & BARS ----- */
.table-container {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}
.filters-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

/* ----- MOBILE CARD STYLES ----- */
.mobile-card-list {
  padding: 16px;
}
.mobile-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.card-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  font-weight: 600;
}
.card-title {
  color: #111827;
}
.card-body {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}
.card-label {
  color: #6b7280;
}
.card-value {
  color: #111827;
  font-weight: 500;
  text-align: right;
}
.card-footer {
  padding: 8px 16px;
  background-color: #f9fafb;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

/* ----- ELEMENT PLUS CUSTOMIZATION ----- */
.page-container :deep(.el-button) {
  border-radius: 6px;
  font-weight: 500;
}
.page-container :deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: none !important;
  border: 1px solid #d1d5db;
}

/* ----- DESKTOP OVERRIDES ----- */
@media (min-width: 768px) {
  .page-container {
    padding: 24px 32px;
  }
  .page-title {
    font-size: 1.75rem;
  }
  .filters-bar {
    padding: 16px 20px;
  }
  .pagination-container {
    justify-content: flex-end;
  }
  .page-container :deep(.el-button--primary) {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  .page-container :deep(.el-input) {
    max-width: 400px;
  }
  .page-container :deep(.el-table th) {
    background-color: #f9fafb !important;
    color: #6b7280;
    font-weight: 600;
  }
  .page-container :deep(.el-table td.el-table__cell) {
    border-bottom: 1px solid #f3f4f6;
    padding: 14px 0;
  }
  .page-container :deep(.el-table .el-table__row:hover > td) {
    background-color: #f9fafb !important;
  }
  .page-container
    :deep(
      .el-pagination.is-background .el-pager li:not(.is-disabled).is-active
    ) {
    background-color: #2563eb;
  }
}
</style>
