<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Đơn trả hàng</h1>
      <el-button type="primary" :icon="Plus" @click="createReturnOrder">
        Tạo đơn trả hàng
      </el-button>
    </div>

    <div class="table-container">
      <div class="filters-bar">
        <el-input
          v-model="search"
          placeholder="Tìm theo mã phiếu, mã đơn gốc, tên khách..."
          clearable
          :prefix-icon="Search"
        />
        <el-select
          v-if="!isMobile"
          v-model="statusFilter"
          placeholder="Trạng thái"
          clearable
        >
          <el-option label="Chờ xử lý" value="Chờ xử lý"></el-option>
          <el-option label="Đã hoàn tiền" value="Đã hoàn tiền"></el-option>
          <el-option label="Đã nhập kho" value="Đã nhập kho"></el-option>
          <el-option label="Đã từ chối" value="Đã từ chối"></el-option>
        </el-select>
      </div>

      <el-table v-if="!isMobile" :data="pagedReturns" style="width: 100%">
        <el-table-column prop="returnCode" label="Mã phiếu trả" width="140" />
        <el-table-column prop="originalOrderCode" label="Đơn gốc" width="120" />
        <el-table-column
          prop="customerName"
          label="Khách hàng"
          min-width="180"
        />
        <el-table-column prop="returnDate" label="Ngày trả" width="150" />
        <el-table-column label="Tiền hoàn trả" width="160" align="right">
          <template #default="scope">
            <span class="refund-amount">{{
              formatCurrency(scope.row.refundAmount)
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
            <el-button size="small" :icon="View" text bg>Xem</el-button>
          </div>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-card-list">
        <div
          v-for="item in pagedReturns"
          :key="item.returnCode"
          class="mobile-card"
        >
          <div class="card-header">
            <div class="card-title-group">
              <span class="card-title">Khách: {{ item.customerName }}</span>
              <span class="card-subtitle">Mã phiếu: {{ item.returnCode }}</span>
            </div>
            <el-tag
              :type="getStatusType(item.status)"
              effect="light"
              size="small"
            >
              {{ item.status }}
            </el-tag>
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">Đơn gốc</span>
              <span class="card-value">{{ item.originalOrderCode }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Ngày trả</span>
              <span class="card-value">{{ item.returnDate }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Tiền hoàn trả</span>
              <span class="card-value refund-amount">{{
                formatCurrency(item.refundAmount)
              }}</span>
            </div>
          </div>
          <div class="card-footer">
            <el-button size="small" :icon="View" text bg
              >Xem chi tiết</el-button
            >
          </div>
        </div>
      </div>

      <el-empty
        v-if="pagedReturns.length === 0"
        description="Không có đơn trả hàng nào"
      />
    </div>

    <div class="pagination-container">
      <el-pagination
        v-if="filteredReturns.length > 0"
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredReturns.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { Search, Plus, View } from "@element-plus/icons-vue";

// --- RESPONSIVE STATE ---
const isMobile = ref(false);
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});

// --- COMPONENT LOGIC ---
const search = ref("");
const statusFilter = ref("");
const currentPage = ref(1);
const pageSize = 10;

const returns = ref([
  {
    returnCode: "RT001",
    originalOrderCode: "DH1234",
    customerName: "Trần Văn An",
    returnDate: "2025-08-01",
    refundAmount: 250000,
    status: "Đã hoàn tiền",
  },
  {
    returnCode: "RT002",
    originalOrderCode: "DH1230",
    customerName: "Nguyễn Thị Bình",
    returnDate: "2025-07-30",
    refundAmount: 180000,
    status: "Chờ xử lý",
  },
  {
    returnCode: "RT003",
    originalOrderCode: "DH1225",
    customerName: "Lê Hoàng Cường",
    returnDate: "2025-07-28",
    refundAmount: 500000,
    status: "Đã nhập kho",
  },
  {
    returnCode: "RT004",
    originalOrderCode: "DH1220",
    customerName: "Phạm Mỹ Duyên",
    returnDate: "2025-07-25",
    refundAmount: 95000,
    status: "Đã từ chối",
  },
]);

const formatCurrency = (value) => value.toLocaleString("vi-VN") + "đ";

const getStatusType = (status) => {
  if (status === "Đã hoàn tiền" || status === "Đã nhập kho") return "success";
  if (status === "Chờ xử lý") return "warning";
  if (status === "Đã từ chối") return "danger";
  return "info";
};

const filteredReturns = computed(() => {
  return returns.value.filter((item) => {
    const searchMatch = search.value
      ? item.returnCode.toLowerCase().includes(search.value.toLowerCase()) ||
        item.originalOrderCode
          .toLowerCase()
          .includes(search.value.toLowerCase()) ||
        item.customerName.toLowerCase().includes(search.value.toLowerCase())
      : true;
    const statusMatch = statusFilter.value
      ? item.status === statusFilter.value
      : true;
    return searchMatch && statusMatch;
  });
});

const pagedReturns = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredReturns.value.slice(start, start + pageSize);
});

const createReturnOrder = () => {};
</script>

<style scoped>
/* @import "./responsive-style.css"; Sử dụng file CSS chung */

.refund-amount {
  font-weight: 600;
  color: #c026d3; /* Màu tím cho tiền bạc :D */
}
.filters-bar {
  justify-content: space-between;
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
