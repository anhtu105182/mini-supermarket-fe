<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Đơn nhập hàng</h1>
      <div class="action-buttons-group">
        <el-button :icon="Upload" @click="importDialogVisible = true"
          >Nhập file</el-button
        >
        <el-button type="primary" :icon="Plus" @click="createReceipt">
          Tạo đơn nhập hàng
        </el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="order-tabs">
      <el-tab-pane label="Tất cả" name="all"></el-tab-pane>
      <el-tab-pane label="Tạm lưu" name="draft"></el-tab-pane>
      <el-tab-pane label="Hoàn thành" name="completed"></el-tab-pane>
    </el-tabs>

    <div class="table-container">
      <div class="filters-bar">
        <el-input
          v-model="search"
          placeholder="Tìm theo mã phiếu, mã đơn đặt hàng..."
          clearable
          :prefix-icon="Search"
        />
        <el-select
          v-if="!isMobile"
          v-model="supplierFilter"
          placeholder="Nhà cung cấp"
          clearable
        >
          <el-option label="Nhà cung cấp A" value="Nhà cung cấp A"></el-option>
          <el-option label="Nhà cung cấp B" value="Nhà cung cấp B"></el-option>
        </el-select>
      </div>

      <el-table
        v-if="!isMobile"
        :data="pagedReceipts"
        v-loading="isLoading"
        style="width: 100%"
      >
        <el-table-column prop="receiptCode" label="Mã phiếu nhập" width="160" />
        <el-table-column prop="poCode" label="Đơn đặt hàng" width="150" />
        <el-table-column prop="supplier" label="Nhà cung cấp" min-width="180" />
        <el-table-column prop="receivedDate" label="Ngày nhập" width="160" />
        <el-table-column label="Tổng tiền" width="150" align="right">
          <template #default="scope"
            ><span class="total-amount">{{
              formatCurrency(scope.row.totalValue)
            }}</span></template
          >
        </el-table-column>
        <el-table-column prop="employee" label="Nhân viên nhận" width="160" />
        <el-table-column label="Trạng thái" width="120" align="center">
          <template #default="scope"
            ><el-tag
              :type="getStatusType(scope.row.status)"
              effect="light"
              size="small"
              >{{ scope.row.status }}</el-tag
            ></template
          >
        </el-table-column>
        <el-table-column label="Thao tác" width="120" align="center">
          <div class="action-buttons">
            <el-button size="small" :icon="View" text bg>Xem</el-button>
          </div>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-card-list">
        <div
          v-for="item in pagedReceipts"
          :key="item.receiptCode"
          class="mobile-card"
        >
          <div class="card-header">
            <div class="card-title-group">
              <span class="card-title">{{ item.receiptCode }}</span>
              <span class="card-subtitle">{{ item.supplier }}</span>
            </div>
            <el-tag
              :type="getStatusType(item.status)"
              effect="light"
              size="small"
              >{{ item.status }}</el-tag
            >
          </div>
          <div class="card-body">
            <div class="card-row">
              <span class="card-label">Đơn đặt hàng</span>
              <span class="card-value">{{ item.poCode }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Ngày nhập</span>
              <span class="card-value">{{ item.receivedDate }}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Tổng tiền</span>
              <span class="card-value total-amount">{{
                formatCurrency(item.totalValue)
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

      <el-empty v-if="!isLoading && pagedReceipts.length === 0">
        <template #description>
          <div class="orders-empty-title">Chưa có đơn nhập hàng nào</div>
          <p class="orders-empty-desc">
            Tạo mới đơn nhập hàng để ghi nhận nhập kho và tăng số lượng tồn cho
            sản phẩm.
          </p>
        </template>
        <el-button type="primary" :icon="Plus" @click="createReceipt">
          Tạo đơn nhập hàng
        </el-button>
      </el-empty>
    </div>

    <div class="pagination-container">
      <el-pagination
        v-if="filteredReceipts.length > 0"
        :small="isMobile"
        background
        layout="total, prev, pager, next"
        :total="filteredReceipts.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
      />
    </div>

    <el-dialog
      v-model="importDialogVisible"
      title="Nhập file đơn nhập hàng"
      width="600px"
      align-center
    >
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { Search, Plus, View, Upload, Download } from "@element-plus/icons-vue";

const isMobile = ref(false);
const isLoading = ref(true);
const search = ref("");
const activeTab = ref("all");
const supplierFilter = ref("");
const currentPage = ref(1);
const pageSize = 10;
const receipts = ref([]);
const importDialogVisible = ref(false);

const sampleReceipts = [
  {
    receiptCode: "PN20250808-01",
    poCode: "PO20250808-01",
    supplier: "Nhà cung cấp A",
    receivedDate: "2025-08-08",
    employee: "Nhân viên kho A",
    totalValue: 5500000,
    status: "Hoàn thành",
  },
  {
    receiptCode: "PN20250807-02",
    poCode: "PO20250807-03",
    supplier: "Nhà cung cấp B",
    receivedDate: "2025-08-07",
    employee: "Nhân viên kho B",
    totalValue: 12000000,
    status: "Hoàn thành",
  },
  {
    receiptCode: "PN20250807-01",
    poCode: "PO20250807-02",
    supplier: "Nhà cung cấp A",
    receivedDate: "2025-08-07",
    employee: "Nhân viên kho A",
    totalValue: 3200000,
    status: "Tạm lưu",
  },
];

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};
const formatCurrency = (value) => value.toLocaleString("vi-VN") + "đ";

const getStatusType = (status) => {
  if (status === "Hoàn thành") return "success";
  if (status === "Tạm lưu") return "warning";
  return "info";
};

// === SỬA ĐỔI: Thêm hàm chuyển đổi từ tab name sang status text ===
const getStatusFromTab = (tabName) => {
  const statusMap = {
    draft: "Tạm lưu",
    completed: "Hoàn thành",
  };
  return statusMap[tabName];
};

const filteredReceipts = computed(() => {
  return receipts.value.filter((item) => {
    const searchMatch = search.value
      ? item.receiptCode.toLowerCase().includes(search.value.toLowerCase()) ||
        item.poCode.toLowerCase().includes(search.value.toLowerCase())
      : true;
    const supplierMatch = supplierFilter.value
      ? item.supplier === supplierFilter.value
      : true;

    // === SỬA ĐỔI: Sửa lại logic lọc theo tab cho chính xác ===
    const tabMatch =
      activeTab.value === "all"
        ? true
        : item.status === getStatusFromTab(activeTab.value);
    return searchMatch && supplierMatch && tabMatch;
  });
});

const pagedReceipts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredReceipts.value.slice(start, start + pageSize);
});

const createReceipt = () => {};
watch([search, activeTab, supplierFilter], () => {
  currentPage.value = 1;
});

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  setTimeout(() => {
    receipts.value = sampleReceipts;
    isLoading.value = false;
  }, 500);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>
/* @import './responsive-style.css'; */
.total-amount {
  font-weight: 600;
}
.filters-bar {
  justify-content: space-between;
}
.order-tabs {
  margin-bottom: 1px;
}
.order-tabs :deep(.el-tabs__header) {
  margin-bottom: 0;
  padding: 0 20px;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  border: 1px solid #e5e7eb;
  border-bottom: none;
}
.table-container {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
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
  margin-bottom: 20px;
  line-height: 1.5;
}

@media (max-width: 767px) {
  .order-tabs :deep(.el-tabs__header) {
    padding: 0;
  }
  .order-tabs :deep(.el-tabs__nav) {
    width: 100%;
    display: flex;
  }
  .order-tabs :deep(.el-tabs__item) {
    flex: 1;
    text-align: center;
    padding: 0 5px;
  }
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
