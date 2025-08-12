<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">Đơn hàng nháp</h1>
      <el-button type="primary" :icon="Plus" @click="createDraftOrder">
        Tạo đơn nháp
      </el-button>
    </div>

    <div class="table-container">
      <div class="filters-bar"></div>

      <el-table
        v-if="!isMobile"
        :data="pagedDrafts"
        v-loading="isLoading"
        style="width: 100%"
      >
        <el-table-column prop="draftCode" label="Mã đơn nháp" width="150" />
        <el-table-column prop="createdBy" label="Người tạo" width="150" />
        <el-table-column
          prop="customerName"
          label="Khách hàng"
          min-width="180"
        />
        <el-table-column prop="createdDate" label="Ngày tạo" width="160" />
        <el-table-column label="Giá trị" width="150" align="right">
          <template #default="scope">
            <span class="total-amount">{{
              formatCurrency(scope.row.totalAmount)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column label="Thao tác" width="220" align="center">
          <template #default>
            <div class="action-buttons">
              <el-button size="small" type="primary" :icon="ShoppingCartFull"
                >Hoàn tất đơn</el-button
              >

              <el-dropdown trigger="click">
                <el-button
                  size="small"
                  :icon="MoreFilled"
                  circle
                  text
                  style="margin-left: 8px"
                />
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :icon="Promotion"
                      >Gửi link thanh toán</el-dropdown-item
                    >
                    <el-dropdown-item :icon="Delete" class="delete-action"
                      >Xóa</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-else class="mobile-card-list"></div>

      <el-empty v-if="!isLoading && pagedDrafts.length === 0"> </el-empty>
    </div>

    <div class="pagination-container"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
// SỬA ĐỔI: Thêm icon MoreFilled cho dropdown
import {
  Search,
  Plus,
  Promotion,
  ShoppingCartFull,
  Delete,
  MoreFilled,
} from "@element-plus/icons-vue";

// --- STATE ---
const isMobile = ref(false);
const isLoading = ref(true);
const search = ref("");
const dateRange = ref("");
const currentPage = ref(1);
const pageSize = 10;
const drafts = ref([]);

// --- DỮ LIỆU MẪU ---
const sampleDrafts = [
  {
    draftCode: "DRAFT001",
    createdBy: "Nhân viên A",
    customerName: "Nguyễn Văn An",
    createdDate: "2025-08-08 11:05",
    totalAmount: 150000,
  },
  {
    draftCode: "DRAFT002",
    createdBy: "Admin",
    customerName: "Khách vãng lai",
    createdDate: "2025-08-07 16:20",
    totalAmount: 320000,
  },
  {
    draftCode: "DRAFT003",
    createdBy: "Nhân viên B",
    customerName: "Trần Thị Bích",
    createdDate: "2025-08-06 09:30",
    totalAmount: 85000,
  },
];

// --- LOGIC ---
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};
const formatCurrency = (value) => value.toLocaleString("vi-VN") + "đ";

const filteredDrafts = computed(() => {
  return drafts.value.filter((item) => {
    const searchMatch = search.value
      ? item.draftCode.toLowerCase().includes(search.value.toLowerCase()) ||
        item.customerName.toLowerCase().includes(search.value.toLowerCase())
      : true;

    return searchMatch;
  });
});

const pagedDrafts = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredDrafts.value.slice(start, start + pageSize);
});

const createDraftOrder = () => {};
watch(search, () => {
  currentPage.value = 1;
});

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  setTimeout(() => {
    drafts.value = sampleDrafts;
    isLoading.value = false;
  }, 500);
});
onBeforeUnmount(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<style scoped>
.total-amount {
  font-weight: 600;
  color: #1f2937;
}
.filters-bar {
  justify-content: space-between;
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
/* SỬA ĐỔI: CSS cho dropdown menu và action button */
.action-buttons {
  display: flex;
  align-items: center;
  justify-content: center;
}
.delete-action {
  color: var(--el-color-danger);
}
.delete-action:hover {
  background-color: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
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
